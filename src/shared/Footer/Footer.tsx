import { useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { trackNewsletterSubscribe } from "@/lib/analytics";
import {
    EmailSendError,
    isValidEmail,
    subscribeNewsletter,
} from "@/lib/services/email";
import { Link, useLocation } from "react-router-dom";
import { PORTFOLIO_ENABLED } from "@/lib/features";
import { NavAnchor, PAGES_WITH_DISCOVERY } from "@/shared/Navbar";
import "./footer.css";

const SHOW_PORTFOLIO_LINK = false;
const EMAIL_MAX_LENGTH = 254;

const getEmailError = (value: string): string => {
    const email = value.trim();
    if (!email) return "Please enter your email address.";
    if (email.length > EMAIL_MAX_LENGTH) {
        return "That email address is too long.";
    }
    if (/\s/.test(email)) return "Email addresses can’t contain spaces.";
    const atCount = email.split("@").length - 1;
    if (atCount === 0) return "Your email address is missing an \"@\".";
    if (atCount > 1) return "Your email address can only contain one \"@\".";
    const [local, domain] = email.split("@");
    if (!local) return "Please add the part before the \"@\".";
    if (!domain) return "Please add a domain after the \"@\", e.g. name@company.com.";
    if (
        !domain.includes(".") ||
        domain.startsWith(".") ||
        domain.endsWith(".") ||
        domain.includes("..")
    ) {
        return "Please check the domain, e.g. name@company.com.";
    }
    if (!isValidEmail(email)) return "Please enter a valid email address.";
    return "";
};

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { pathname } = useLocation();
    const isHome = pathname === "/";
    // From other pages, homepage sections are reached through the homepage URL.
    const homeSection = (hash: string) => (isHome ? hash : `/${hash}`);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
        "idle",
    );
    const [message, setMessage] = useState("");
    const [validationError, setValidationError] = useState("");
    const emailInputRef = useRef<HTMLInputElement>(null);
    const submittingRef = useRef(false);

    const isSubmitting = status === "submitting";
    const hasError = Boolean(validationError) || status === "error";
    const isReady = !isSubmitting && isValidEmail(email);

    const handleNewsletterSubmit: FormEventHandler<HTMLFormElement> = async (
        event,
    ) => {
        event.preventDefault();
        if (submittingRef.current) return;

        const trimmed = email.trim();
        if (trimmed !== email) setEmail(trimmed);

        const error = getEmailError(trimmed);
        if (error) {
            setValidationError(error);
            setStatus("idle");
            setMessage("");
            emailInputRef.current?.focus();
            return;
        }

        submittingRef.current = true;
        setValidationError("");
        setStatus("submitting");
        setMessage("");

        try {
            const result = await subscribeNewsletter(trimmed);
            trackNewsletterSubscribe();
            setStatus("success");
            setMessage(
                result.alreadySubscribed
                    ? "You’re already on the list. Thanks for staying with us."
                    : "You’re in. We’ll share fresh thinking and practical tech.",
            );
            setEmail("");
        } catch (error) {
            setStatus("error");
            setMessage(
                error instanceof EmailSendError
                    ? error.message
                    : "Could not subscribe right now. Please try again.",
            );
            emailInputRef.current?.focus();
        } finally {
            submittingRef.current = false;
        }
    };

    return (
        <footer id="footer" className="site-footer" aria-label="Bonotech footer">
            <div className="footer-atmosphere" aria-hidden="true" />

            <div className="footer-panel">
                <div className="footer-main">
                    <div className="footer-brand">
                        <NavAnchor
                            className="footer-brand-link"
                            href={isHome ? "#home" : "/"}
                            aria-label="Bonotech — back to home"
                        >
                            <span className="footer-logo" aria-hidden="true" />
                        </NavAnchor>
                        <p>
                            Building innovative digital products that help businesses
                            transition into the age of AI.
                        </p>
                    </div>

                    <nav
                        className="footer-explore"
                        aria-labelledby="footer-explore-title"
                    >
                        <h2 id="footer-explore-title" className="footer-label">
                            Explore
                        </h2>
                        <ul>
                            <li>
                                <NavAnchor href={homeSection("#about-bonotech")}>About Bonotech</NavAnchor>
                            </li>
                            {PORTFOLIO_ENABLED ? (
                                <li>
                                    <Link to="/portfolio">Portfolio</Link>
                                </li>
                            ) : null}
                            <li>
                                <NavAnchor href={homeSection("#ways-in")}>Our Service Scope</NavAnchor>
                            </li>
                            <li>
                                <NavAnchor href={homeSection("#delivery-times")}>Average Delivery Times</NavAnchor>
                            </li>
                            <li>
                                <NavAnchor href={homeSection("#our-technology")}>Our Technology</NavAnchor>
                            </li>
                            <li>
                                <NavAnchor href={homeSection("#client-testimonials")}>Client Testimonials</NavAnchor>
                            </li>
                            {SHOW_PORTFOLIO_LINK ? (
                                <li>
                                    <a
                                        href="/Bonotech-Portfolio.pdf"
                                        download="Bonotech-Portfolio-V3.pdf"
                                    >
                                        Download Portfolio
                                    </a>
                                </li>
                            ) : null}
                            <li>
                                <NavAnchor
                                    className="footer-discovery-link"
                                    href={
                                        PAGES_WITH_DISCOVERY.has(pathname)
                                            ? "#discovery-call"
                                            : "/#discovery-call"
                                    }
                                >
                                    Book a Discovery Call{" "}
                                    <span aria-hidden="true">↗</span>
                                </NavAnchor>
                            </li>
                        </ul>
                    </nav>

                    <div className="footer-contact">
                        <h2 className="footer-label">Get in Touch</h2>
                        <a className="footer-email" href="mailto:contact@bonotech.io">
                            contact@bonotech.io
                        </a>
                        <a className="footer-phone" href="tel:+447551829217">
                            +44 7551 829217
                        </a>
                        <address>
                            <strong>BONOTECH HOLDINGS PTE. LTD.</strong>
                            <span>111 SOMERSET ROAD #08-10A</span>
                            <span>Singapore 238164</span>
                        </address>
                    </div>

                    <div
                        className="footer-newsletter"
                        aria-labelledby="footer-newsletter-title"
                    >
                        <h2 id="footer-newsletter-title" className="footer-label">
                            Stay in the Loop
                        </h2>
                        <p className="footer-newsletter-title">
                            Fresh Thinking.
                            <br />
                            Practical Tech.
                        </p>
                        <p className="footer-newsletter-description">
                            Product insights, smarter systems, and AI that works for
                            business.
                        </p>
                        <form
                            className="footer-newsletter-form"
                            onSubmit={handleNewsletterSubmit}
                            noValidate
                        >
                            <label htmlFor="footer-newsletter-email">
                                Email address
                            </label>
                            <div
                                className={`footer-newsletter-field${
                                    hasError ? " is-error" : ""
                                }`}
                            >
                                <input
                                    ref={emailInputRef}
                                    id="footer-newsletter-email"
                                    type="email"
                                    name="newsletterEmail"
                                    inputMode="email"
                                    autoComplete="email"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    placeholder="Your email address"
                                    aria-describedby="footer-newsletter-note"
                                    aria-invalid={hasError}
                                    aria-errormessage={
                                        hasError ? "footer-newsletter-note" : undefined
                                    }
                                    maxLength={EMAIL_MAX_LENGTH}
                                    value={email}
                                    onChange={(event) => {
                                        const next = event.target.value;
                                        setEmail(next);
                                        if (validationError) {
                                            setValidationError(getEmailError(next));
                                        }
                                        if (status !== "idle") {
                                            setStatus("idle");
                                            setMessage("");
                                        }
                                    }}
                                    onBlur={() => {
                                        if (isSubmitting) return;
                                        const trimmed = email.trim();
                                        if (trimmed !== email) setEmail(trimmed);
                                        if (trimmed) {
                                            setValidationError(getEmailError(trimmed));
                                        }
                                    }}
                                    readOnly={isSubmitting}
                                    aria-busy={isSubmitting}
                                    required
                                />
                                <button
                                    type="submit"
                                    aria-label={
                                        isSubmitting
                                            ? "Subscribing to the newsletter"
                                            : "Subscribe to the newsletter"
                                    }
                                    aria-disabled={isSubmitting}
                                    data-ready={isReady}
                                    data-submitting={isSubmitting}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M5 12h14m-6-6 6 6-6 6"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <p
                                id="footer-newsletter-note"
                                className={`footer-newsletter-note${
                                    status === "success"
                                        ? " is-success"
                                        : hasError
                                          ? " is-error"
                                          : ""
                                }`}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {validationError ||
                                    message ||
                                    (isSubmitting
                                        ? "Subscribing…"
                                        : "No spam, just useful updates when we have them.")}
                            </p>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {currentYear} Bonotech Holdings Pte. Ltd.
                        <span>All rights reserved.</span>
                    </p>

                    <a
                        className="footer-top-link"
                        href={
                            pathname === "/portfolio"
                                ? "#portfolio"
                                : pathname === "/"
                                  ? "#home"
                                  : "#main-content"
                        }
                        aria-label="Back to top"
                        onClick={(event) => {
                            event.preventDefault();
                            const reduced = window.matchMedia(
                                "(prefers-reduced-motion: reduce)",
                            ).matches;
                            window.scrollTo({
                                top: 0,
                                behavior: reduced ? "auto" : "smooth",
                            });
                            history.replaceState(
                                history.state,
                                "",
                                event.currentTarget.getAttribute("href"),
                            );
                        }}
                    >
                        <span>Back to Top</span>
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M12 19V5m-6 6 6-6 6 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>

                    <nav className="footer-socials" aria-label="Follow Bonotech">
                        <a
                            href="https://x.com/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on X (opens in a new tab)"
                        >
                            <span>X</span>
                        </a>
                        <a
                            href="https://www.instagram.com/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on Instagram (opens in a new tab)"
                        >
                            <span>IG</span>
                        </a>
                        <a
                            href="https://www.facebook.com/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on Facebook (opens in a new tab)"
                        >
                            <span>FB</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on LinkedIn (opens in a new tab)"
                        >
                            <span>LI</span>
                        </a>
                    </nav>
                </div>
            </div>

            <div className="footer-video-space" aria-hidden="true" />
        </footer>
    );
};

export default Footer;
