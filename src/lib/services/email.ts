const EMAIL_API_BASE =
  import.meta.env.VITE_EMAIL_API_BASE?.trim() ||
  (import.meta.env.DEV ? "" : "https://rpa.dekkoai.online/bonotech-api");
const EMAIL_API_PATH = "/send-email";
const CONTACT_RECIPIENT = "ekram@edutechs.app";
const DISCOVERY_CALL_RECIPIENTS = [
  "ekram@edutechs.app",
  "humaira@di.vc",
] as const;

// ─── Types ───────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface DiscoveryCallFormData {
  fullName: string;
  email: string;
  company: string;
  companySize: string;
  role: string;
  website: string;
  focus: string;
  brief: string;
  date: string;
  dateLabel: string;
  time: string;
  timeZone: string;
  durationMinutes: number;
}

interface EmailPayload {
  recepient: string[];
  subject: string;
  customHTML: string;
  senderName: string;
  senderEmail: string;
}

interface EmailApiResponse {
  message: string | Record<string, unknown>;
}

export class EmailSendError extends Error {
  override cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EmailSendError";
    this.cause = cause;
  }
}

// ─── Validation ──────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/;

export const isValidEmail = (value: string) => {
  const email = value.trim();
  return email.length <= 254 && EMAIL_RE.test(email);
};

export function validateContactForm(
  data: ContactFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const phone = data.phone.trim();
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required.";
  }

  return errors;
}

// ─── Email builder ───────────────────────────────────────────────────

function buildContactEmailHtml(data: ContactFormData): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `
    <div style="font-family:Arial,sans-serif;color:#262626;max-width:600px;margin:0 auto;">
      <h2 style="color:#8269cf;margin-bottom:24px;">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;font-weight:bold;width:140px;vertical-align:top;">Name</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;">${esc(data.name.trim())}</td>
        </tr>
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">Email</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;">${esc(data.email.trim())}</td>
        </tr>
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">Phone</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;">${esc(data.phone.trim())}</td>
        </tr>
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">Message</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;white-space:pre-wrap;">${esc(data.message.trim())}</td>
        </tr>
      </table>
      <p style="margin-top:24px;font-size:13px;color:#999;">
        Sent from the Bonotech contact form.
      </p>
    </div>
  `.trim();
}

// ─── API call ────────────────────────────────────────────────────────

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new EmailSendError(`Server responded with status ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof EmailSendError) throw err;

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new EmailSendError("Request timed out. Please try again.");
    }

    throw new EmailSendError(
      "Unable to reach the server. Please check your connection and try again.",
      err,
    );
  } finally {
    clearTimeout(timeout);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildDiscoveryCallEmailHtml(data: DiscoveryCallFormData): string {
  const esc = escapeHtml;
  const optional = (value: string) => value.trim() || "—";

  const rows: Array<[string, string]> = [
    ["Name", data.fullName.trim()],
    ["Email", data.email.trim()],
    ["Company", data.company.trim()],
    ["Company size", data.companySize.trim()],
    ["Role", optional(data.role)],
    ["Website", optional(data.website)],
    ["Focus", data.focus.trim()],
    ["Desired outcome", optional(data.brief)],
    ["Date", data.dateLabel.trim() || data.date.trim()],
    ["Time", data.time.trim()],
    ["Time zone", data.timeZone.trim()],
    ["Duration", `${data.durationMinutes} minutes`],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;font-weight:bold;width:160px;vertical-align:top;">${esc(label)}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;white-space:pre-wrap;">${esc(value)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#262626;max-width:600px;margin:0 auto;">
      <h2 style="color:#8269cf;margin-bottom:24px;">New Discovery Call Request</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${tableRows}
      </table>
      <p style="margin-top:24px;font-size:13px;color:#999;">
        Sent from the Bonotech discovery call form.
      </p>
    </div>
  `.trim();
}

export function validateDiscoveryCallForm(
  data: DiscoveryCallFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.company.trim()) {
    errors.company = "Company name is required.";
  }

  if (!data.companySize.trim()) {
    errors.companySize = "Company size is required.";
  }

  if (!data.focus.trim()) {
    errors.focus = "Please choose what we can help with.";
  }

  if (!data.date.trim()) {
    errors.date = "Please select a date.";
  }

  if (!data.time.trim()) {
    errors.time = "Please select a time.";
  }

  if (!data.timeZone.trim()) {
    errors.timeZone = "Please select a time zone.";
  }

  return errors;
}

async function sendMarketingEmail(payload: EmailPayload): Promise<void> {
  const response = await postJSON<EmailApiResponse>(
    `${EMAIL_API_BASE}${EMAIL_API_PATH}`,
    {
      ...payload,
      // Backend accepts a comma list or array; keep list for clarity.
      recepient: payload.recepient,
    },
  );

  if (response?.message === "Failed") {
    throw new EmailSendError(
      "The server could not send the email. Please try again later.",
    );
  }
}

/**
 * Sends a contact-form email to the configured recipient via the
 * Bonotech mail API.
 *
 * Throws `EmailSendError` on validation failure, network issues, or
 * server-side rejection.
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const errors = validateContactForm(data);
  if (Object.keys(errors).length > 0) {
    const first = Object.values(errors)[0];
    throw new EmailSendError(first);
  }

  const senderEmail = data.email.trim() || "noreply@bonotech.io";

  await sendMarketingEmail({
    recepient: [CONTACT_RECIPIENT],
    subject: `New Inquiry from ${data.name.trim()} — Bonotech Contact Form`,
    customHTML: buildContactEmailHtml(data),
    senderName: data.name.trim(),
    senderEmail,
  });
}

/**
 * Sends a discovery-call booking email to the Bonotech recipients via the
 * Bonotech mail API.
 */
export async function sendDiscoveryCallEmail(
  data: DiscoveryCallFormData,
): Promise<void> {
  const errors = validateDiscoveryCallForm(data);
  if (Object.keys(errors).length > 0) {
    const first = Object.values(errors)[0];
    throw new EmailSendError(first);
  }

  const senderEmail = data.email.trim() || "noreply@bonotech.io";
  const name = data.fullName.trim();

  await sendMarketingEmail({
    recepient: [...DISCOVERY_CALL_RECIPIENTS],
    subject: `Discovery Call: ${name} — ${data.dateLabel.trim() || data.date.trim()} ${data.time.trim()}`,
    customHTML: buildDiscoveryCallEmailHtml(data),
    senderName: name,
    senderEmail,
  });
}

export interface NewsletterSubscribeResult {
  alreadySubscribed: boolean;
}

/**
 * Saves a newsletter email on the Bonotech API (JSON file on the server).
 */
export async function subscribeNewsletter(
  email: string,
): Promise<NewsletterSubscribeResult> {
  const cleaned = email.trim().toLowerCase();

  if (!cleaned) {
    throw new EmailSendError("Please enter your email address.");
  }

  if (!EMAIL_RE.test(cleaned) || cleaned.length > 254) {
    throw new EmailSendError("Please enter a valid email address.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${EMAIL_API_BASE}/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleaned }),
      signal: controller.signal,
    });

    let payload: {
      message?: string;
      error?: string;
      alreadySubscribed?: boolean;
    } = {};

    try {
      payload = (await res.json()) as typeof payload;
    } catch {
      // ignore JSON parse errors; fall through to status handling
    }

    if (!res.ok || payload.message === "Failed") {
      throw new EmailSendError(
        payload.error?.trim() ||
          "Could not subscribe right now. Please try again.",
      );
    }

    return { alreadySubscribed: Boolean(payload.alreadySubscribed) };
  } catch (err) {
    if (err instanceof EmailSendError) throw err;

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new EmailSendError("Request timed out. Please try again.");
    }

    throw new EmailSendError(
      "Unable to reach the server. Please check your connection and try again.",
      err,
    );
  } finally {
    clearTimeout(timeout);
  }
}
