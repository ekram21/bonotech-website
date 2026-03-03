import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ContactProps } from "./Contact.types";
import {
  sendContactEmail,
  validateContactForm,
  EmailSendError,
  type ContactFormData,
} from "@/lib/services/email";
import contactBg from "@/assets/contact-section-bg.png";

type FormStatus = "idle" | "sending" | "success" | "error";

const INITIAL_FORM: ContactFormData = {
  name: "",
  emailOrPhone: "",
  projectDetails: "",
};

const SUCCESS_RESET_MS = 5_000;

export function Contact({ className }: ContactProps) {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateField = useCallback(
    <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateContactForm(form);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setStatus("sending");
      setStatusMessage("");

      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
        resetTimer.current = null;
      }

      try {
        await sendContactEmail(form);
        setStatus("success");
        setStatusMessage("Message sent! We'll get back to you soon.");
        setForm(INITIAL_FORM);

        resetTimer.current = setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, SUCCESS_RESET_MS);
      } catch (err) {
        setStatus("error");
        setStatusMessage(
          err instanceof EmailSendError
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    },
    [form],
  );

  const isBusy = status === "sending";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={cn("relative w-full bg-surface-neutral", className)}
    >
      <div className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex flex-col items-center py-28">
        {/* Section Title — "Let's Connect" with gradient */}
        <div className="relative flex flex-col items-center select-none mb-10">
          <h2
            id="contact-heading"
            className="font-body font-normal text-center text-[clamp(44px,12vw,181.9px)] leading-[0.8] tracking-normal bg-[linear-gradient(180deg,#8269cf81_0%,transparent_100%)] bg-clip-text text-transparent"
          >
            Let's Connect
          </h2>
        </div>

        {/* ─── Contact Card ─── */}
        <div className="relative w-full max-w-300 overflow-hidden flex flex-col lg:flex-row justify-between rounded-4xl p-8 md:p-16 lg:h-179.5">
          {/* Background image */}
          <img
            src={contactBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Dark overlay for readability */}
          <div
            className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.3)_100%)]"
            aria-hidden="true"
          />

          {/* ─── Left Content ─── */}
          <div className="relative z-20 flex flex-col justify-center w-full lg:w-1/2">
            <h3 className="font-body font-medium text-white text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.01em] lg:max-w-1/2">
              Have an idea in your mind?
            </h3>
            <p className="font-body font-medium text-white/80 text-base md:text-lg leading-[1.4] mt-4">
              Let's make something happen together
            </p>
          </div>

          {/* ─── Right Form ─── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative z-20 flex flex-col justify-center w-full lg:w-1/2 lg:px-12 gap-8 mt-8 lg:mt-0"
          >
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={isBusy}
                aria-label="Name"
                aria-invalid={!!fieldErrors.name}
                className={cn(
                  "font-body bg-transparent text-base leading-[1.4] font-normal text-white placeholder:text-white outline-none w-full pb-3 border-b transition-colors disabled:opacity-60",
                  fieldErrors.name ? "border-red-400" : "border-[#E8E9EB]",
                )}
              />
              {fieldErrors.name && (
                <p role="alert" className="mt-1.5 text-sm text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email / Phone */}
            <div>
              <input
                type="text"
                placeholder="Email/Phone No"
                value={form.emailOrPhone}
                onChange={(e) => updateField("emailOrPhone", e.target.value)}
                disabled={isBusy}
                aria-label="Email or Phone Number"
                aria-invalid={!!fieldErrors.emailOrPhone}
                className={cn(
                  "font-body bg-transparent text-base leading-[1.4] font-normal text-white placeholder:text-white outline-none w-full pb-3 border-b transition-colors disabled:opacity-60",
                  fieldErrors.emailOrPhone ? "border-red-400" : "border-[#E8E9EB]",
                )}
              />
              {fieldErrors.emailOrPhone && (
                <p role="alert" className="mt-1.5 text-sm text-red-400">
                  {fieldErrors.emailOrPhone}
                </p>
              )}
            </div>

            {/* Project Details */}
            <div>
              <textarea
                placeholder="Project Details"
                value={form.projectDetails}
                onChange={(e) => updateField("projectDetails", e.target.value)}
                disabled={isBusy}
                aria-label="Project Details"
                aria-invalid={!!fieldErrors.projectDetails}
                rows={4}
                className={cn(
                  "font-body bg-transparent text-base leading-[1.4] font-normal text-white placeholder:text-white outline-none w-full pb-3 border-b transition-colors resize-y min-h-[80px] disabled:opacity-60",
                  fieldErrors.projectDetails ? "border-red-400" : "border-[#E8E9EB]",
                )}
              />
              {fieldErrors.projectDetails && (
                <p role="alert" className="mt-1.5 text-sm text-red-400">
                  {fieldErrors.projectDetails}
                </p>
              )}
            </div>

            {/* Status feedback */}
            {statusMessage && (
              <p
                role="status"
                aria-live="polite"
                className={cn(
                  "text-sm font-medium text-center -mb-4",
                  status === "success" && "text-emerald-400",
                  status === "error" && "text-red-400",
                )}
              >
                {statusMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isBusy}
              className="font-body cursor-pointer transition-(--transition-base) hover:opacity-90 w-full h-14 rounded-full bg-white text-[#131314] font-semibold text-base leading-[1.4] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isBusy ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
