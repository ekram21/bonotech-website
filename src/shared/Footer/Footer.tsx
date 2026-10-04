import { useState } from "react";
import type { FormEventHandler } from "react";
import bonotechLogo from "@/assets/bonotech-logo-white.svg";
import { trackNewsletterSubscribe } from "@/lib/analytics";
import {
    EmailSendError,
    subscribeNewsletter,
} from "@/lib/services/email";
import "./footer.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHOW_PORTFOLIO_LINK = false;

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
        "idle",
    );
    const [message, setMessage] = useState("");

    const isEmailValid = EMAIL_RE.test(email.trim());
    const canSubmit = isEmailValid && status !== "submitting";

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleNewsletterSubmit: FormEventHandler<HTMLFormElement> = async (
        event,
    ) => {
        event.preventDefault();
        if (!canSubmit) return;

        setStatus("submitting");
        setMessage("");

        try {
            const result = await subscribeNewsletter(email);
            trackNewsletterSubscribe();
            setStatus("success");
            setMessage(
                result.alreadySubscribed
                    ? "You're already on the list — thanks for staying with us."
                    : "You're in. We'll share fresh thinking and practical tech.",
            );
            setEmail("");
        } catch (error) {
            setStatus("error");
            setMessage(
                error instanceof EmailSendError
                    ? error.message
                    : "Could not subscribe right now. Please try again.",
            );
        }
    };

    return (
        <footer id="footer" className="site-footer" aria-label="Bonotech footer">
            <div className="footer-atmosphere" aria-hidden="true" />

            <div className="footer-panel">
                <div className="footer-main">
                    <div className="footer-brand">
                        <a
                            className="footer-brand-link"
                            href="#home"
                            aria-label="Bonotech — back to home"
                        >
                            <img src={bonotechLogo} alt="Bonotech" />
                        </a>
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
                                <a href="#about-bonotech">About Bonotech</a>
                            </li>
                            <li>
                                <a href="#ways-in">Our Service Scope</a>
                            </li>
                            <li>
                                <a href="#delivery-times">Average Delivery Times</a>
                            </li>
                            <li>
                                <a href="#our-technology">Our Technology</a>
                            </li>
                            <li>
                                <a href="#client-testimonials">Client Testimonials</a>
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
                                <a
                                    className="footer-discovery-link"
                                    href="#discovery-call"
                                >
                                    Book a Discovery Call{" "}
                                    <span aria-hidden="true">↗</span>
                                </a>
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
                            <div className="footer-newsletter-field">
                                <input
                                    id="footer-newsletter-email"
                                    type="email"
                                    name="newsletterEmail"
                                    autoComplete="email"
                                    placeholder="Your email address"
                                    aria-describedby="footer-newsletter-note"
                                    aria-invalid={status === "error"}
                                    maxLength={254}
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        if (status !== "idle") {
                                            setStatus("idle");
                                            setMessage("");
                                        }
                                    }}
                                    disabled={status === "submitting"}
                                    required
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe to the newsletter"
                                    disabled={!canSubmit}
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
                                        : status === "error"
                                          ? " is-error"
                                          : ""
                                }`}
                                aria-live="polite"
                            >
                                {message ||
                                    "No spam — just useful updates when we have them."}
                            </p>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {currentYear} Bonotech Holdings Pte. Ltd.
                        <span>All rights reserved.</span>
                    </p>

                    <button
                        type="button"
                        className="footer-top-link"
                        onClick={scrollToTop}
                        aria-label="Back to top"
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
                    </button>

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
