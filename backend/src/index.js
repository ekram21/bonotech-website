import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import fs from "fs/promises";
import helmet from "helmet";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import {
  appendAnalyticsEvent,
  buildAnalyticsOverview,
  isAdminAuthConfigured,
  requireAdmin,
  verifyAdminLogin,
} from "./adminAnalytics.js";
import {
  buildZoomInfoOverview,
  getClientIp,
  maybeEnrichVisitorIp,
} from "./zoominfo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
const NEWSLETTER_FILE = path.join(DATA_DIR, "newsletter-subscribers.json");

const PORT = Number(process.env.PORT || 8792);
const HOST = "0.0.0.0";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const ALLOWED_RECIPIENTS = new Set(
  (process.env.ALLOWED_RECIPIENTS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_HTML_BYTES = 100_000;

function parseRecipientList(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => String(entry).split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function createTransport() {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (gmailUser && gmailPass) {
    return {
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      }),
      fromAddress: gmailUser,
    };
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    }),
    fromAddress: process.env.SMTP_FROM?.trim() || user,
  };
}

let mail = null;

function getMail() {
  if (!mail) {
    mail = createTransport();
  }
  return mail;
}

const fromName = process.env.MAIL_FROM_NAME?.trim() || "Bonotech Website";

/** Serialize newsletter writes so concurrent posts don't clobber the JSON file. */
let newsletterWriteQueue = Promise.resolve();

async function appendNewsletterSubscriber(email) {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let subscribers = [];
    try {
      const raw = await fs.readFile(NEWSLETTER_FILE, "utf8");
      const parsed = JSON.parse(raw);
      
      if (Array.isArray(parsed)) {
        subscribers = parsed;
      }
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }

    const normalized = email.toLowerCase();
    if (
      subscribers.some(
        (entry) => String(entry?.email ?? "").toLowerCase() === normalized,
      )
    ) {
      return { alreadySubscribed: true };
    }

    subscribers.push({
      email: normalized,
      subscribedAt: new Date().toISOString(),
    });

    await fs.writeFile(
      NEWSLETTER_FILE,
      `${JSON.stringify(subscribers, null, 2)}\n`,
      "utf8",
    );

    return { alreadySubscribed: false };
  };

  const next = newsletterWriteQueue.then(run, run);
  newsletterWriteQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: "120kb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "bonotech-mail-api",
    mailConfigured: Boolean(getMail()),
    adminConfigured: isAdminAuthConfigured(),
  });
});

const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Failed", error: "Too many requests. Try again later." },
});

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Failed", error: "Too many requests. Try again later." },
});

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Failed", error: "Too many requests. Try again later." },
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Failed", error: "Too many login attempts. Try again later." },
});

app.post("/analytics/event", analyticsLimiter, async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const result = await appendAnalyticsEvent(DATA_DIR, {
      ...(req.body ?? {}),
      clientIp,
    });
    if (!result.ok) {
      res.status(400).json({ message: "Failed", error: result.error });
      return;
    }

    // Resolve company visitors via ZoomInfo when API credentials are present.
    if (result.event?.type === "session_start" || result.event?.type === "page_view") {
      maybeEnrichVisitorIp(DATA_DIR, clientIp, {
        sessionId: result.event.sessionId,
        path: result.event.path,
      });
    }

    res.json({ message: "Success" });
  } catch (error) {
    console.error("[bonotech-mail-api] analytics write failed:", error);
    res.status(500).json({ message: "Failed" });
  }
});

app.post("/admin/login", adminLoginLimiter, async (req, res) => {
  try {
    const result = await verifyAdminLogin(req.body?.email, req.body?.password);
    if (!result.ok) {
      res.status(401).json({ message: "Failed", error: result.error });
      return;
    }
    res.json({ message: "Success", token: result.token, email: result.email });
  } catch (error) {
    console.error("[bonotech-mail-api] admin login failed:", error);
    res.status(500).json({ message: "Failed" });
  }
});

app.get("/admin/analytics/overview", requireAdmin, async (req, res) => {
  try {
    const range = String(req.query?.range || "7d");
    const overview = await buildAnalyticsOverview(DATA_DIR, range);
    const sinceMs =
      Date.now() -
      (Number(String(overview.range).replace("d", "")) || 7) * 24 * 60 * 60 * 1000;
    const zoominfo = await buildZoomInfoOverview(DATA_DIR, sinceMs);
    res.json({ message: "Success", ...overview, zoominfo });
  } catch (error) {
    console.error("[bonotech-mail-api] analytics overview failed:", error);
    res.status(500).json({ message: "Failed" });
  }
});

app.get("/admin/me", requireAdmin, (req, res) => {
  res.json({ message: "Success", email: req.admin?.email });
});

app.post("/newsletter", newsletterLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      res.status(400).json({
        message: "Failed",
        error: "Please enter a valid email address.",
      });
      return;
    }
    
    const result = await appendNewsletterSubscriber(email);

    res.json({
      message: "Success",
      alreadySubscribed: result.alreadySubscribed,
    });
  } catch (error) {
    console.error("[bonotech-mail-api] newsletter save failed:", error);
    res.status(500).json({ message: "Failed" });
  }
});

app.post("/send-email", sendLimiter, async (req, res) => {
  try {
    const mailConfig = getMail();

    if (!mailConfig) {
      res.status(503).json({
        message: "Failed",
        error: "Mail transport is not configured on the server.",
      });
      return;
    }

    const {
      recepient,
      recipient,
      subject,
      customHTML,
      senderName,
      senderEmail,
    } = req.body ?? {};

    const recipients = parseRecipientList(recepient ?? recipient);
    const cleanSubject = String(subject ?? "").trim();
    const html = String(customHTML ?? "");
    const replyName = String(senderName ?? "").trim() || "Website visitor";
    const replyEmail = String(senderEmail ?? "").trim();

    if (recipients.length === 0) {
      res.status(400).json({ message: "Failed", error: "Missing recipients." });
      return;
    }

    if (!cleanSubject) {
      res.status(400).json({ message: "Failed", error: "Missing subject." });
      return;
    }

    if (!html.trim()) {
      res.status(400).json({ message: "Failed", error: "Missing email body." });
      return;
    }

    if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
      res.status(400).json({ message: "Failed", error: "Email body too large." });
      return;
    }

    for (const address of recipients) {
      const normalized = address.toLowerCase();
      if (!EMAIL_RE.test(address)) {
        res.status(400).json({ message: "Failed", error: `Invalid recipient: ${address}` });
        return;
      }
      if (ALLOWED_RECIPIENTS.size > 0 && !ALLOWED_RECIPIENTS.has(normalized)) {
        res.status(403).json({ message: "Failed", error: "Recipient not allowed." });
        return;
      }
    }

    if (replyEmail && !EMAIL_RE.test(replyEmail)) {
      res.status(400).json({ message: "Failed", error: "Invalid sender email." });
      return;
    }

    await mailConfig.transporter.sendMail({
      from: `"${fromName}" <${mailConfig.fromAddress}>`,
      to: recipients.join(", "),
      subject: cleanSubject,
      html,
      replyTo: replyEmail
        ? `"${replyName.replace(/"/g, "")}" <${replyEmail}>`
        : undefined,
    });

    res.json({ message: "Success" });
  } catch (error) {
    console.error("[bonotech-mail-api] send failed:", error);
    res.status(500).json({ message: "Failed" });
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, HOST, () => {
  console.log(`[bonotech-mail-api] listening on http://${HOST}:${PORT}`);
  console.log(
    `[bonotech-mail-api] mail configured: ${Boolean(getMail()) ? "yes" : "no"}`,
  );
  console.log(
    `[bonotech-mail-api] admin configured: ${isAdminAuthConfigured() ? "yes" : "no"}`,
  );
});
