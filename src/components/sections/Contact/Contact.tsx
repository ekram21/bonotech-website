import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ContactProps } from "./Contact.types";
import {
  sendContactEmail,
  validateContactForm,
  EmailSendError,
  type ContactFormData,
} from "@/lib/services/email";
import { Mail, Phone, MapPin } from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
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
        setStatusMessage("Message sent! We'll get back to you soon");
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
            : "Something went wrong Please try again",
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
      className={cn("w-full bg-white py-20 md:py-28 overflow-hidden", className)}
    >
      <div className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start w-full">
          {/* ─── Left Content ─── */}
          <div className="lg:col-span-6 flex flex-col lg:justify-between lg:h-full gap-12 lg:gap-0">
            <div>
              <h2
                id="contact-heading"
                className="font-display font-semibold text-[#131314] text-[48px] leading-[1.15] tracking-tight mb-4"
              >
                Get In Touch
              </h2>
              <p className="font-body text-[#444547] text-[18px] leading-[1.6] max-w-xl">
                Schedule a 30- min free discovery call with our Bono-Pros Our
                experts will evaluate your business needs and goals to translate
                them into market-ready business products
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-4 mt-6 lg:mt-24">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-[40px] h-[40px] bg-[#F2F3F4] rounded-full text-[#131314] shrink-0"
                  aria-hidden="true"
                >
                  <Mail size={16} />
                </div>
                <a
                  href="mailto:contact@bonotech.io"
                  className="font-body text-[16px] text-[#272829] hover:underline"
                >
                  contact@bonotech.io
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-[40px] h-[40px] bg-[#F2F3F4] rounded-full text-[#131314] shrink-0"
                  aria-hidden="true"
                >
                  <Phone size={16} />
                </div>
                <a
                  href="tel:+6565156515"
                  className="font-body text-[16px] text-[#272829] hover:underline"
                >
                  +6565156515
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center w-[40px] h-[40px] bg-[#F2F3F4] rounded-full text-[#131314] shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <MapPin size={16} />
                </div>
                <span className="font-body text-[16px] text-[#272829] leading-relaxed max-w-sm">
                  Bonotech Holdings PTE LTD 111 Somerset Road, #08-10A, Singapore
                  238164
                </span>
              </div>
            </div>
          </div>

          {/* ─── Right Form ─── */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-[#F7F7F7] rounded-[24px] p-8 w-full">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
                {/* Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="font-display font-semibold text-[#131314] text-[18px] mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Adam Smith"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    disabled={isBusy}
                    aria-label="Name"
                    aria-invalid={!!fieldErrors.name}
                    className={cn(
                      "w-full bg-transparent border-b pb-2 text-[16px] text-[#272829] placeholder:text-[#B4B6B8] outline-none transition-colors disabled:opacity-60",
                      fieldErrors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#DCDDE0] focus:border-[#7E60E8]",
                    )}
                  />
                  {fieldErrors.name && (
                    <p role="alert" className="mt-1.5 text-sm text-red-500">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="font-display font-semibold text-[#131314] text-[18px] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="demo@gmail.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    disabled={isBusy}
                    aria-label="Email"
                    aria-invalid={!!fieldErrors.email}
                    className={cn(
                      "w-full bg-transparent border-b pb-2 text-[16px] text-[#272829] placeholder:text-[#B4B6B8] outline-none transition-colors disabled:opacity-60",
                      fieldErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#DCDDE0] focus:border-[#7E60E8]",
                    )}
                  />
                  {fieldErrors.email && (
                    <p role="alert" className="mt-1.5 text-sm text-red-500">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="font-display font-semibold text-[#131314] text-[18px] mb-2"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="++12345-678910"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    disabled={isBusy}
                    aria-label="Phone"
                    aria-invalid={!!fieldErrors.phone}
                    className={cn(
                      "w-full bg-transparent border-b pb-2 text-[16px] text-[#272829] placeholder:text-[#B4B6B8] outline-none transition-colors disabled:opacity-60",
                      fieldErrors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#DCDDE0] focus:border-[#7E60E8]",
                    )}
                  />
                  {fieldErrors.phone && (
                    <p role="alert" className="mt-1.5 text-sm text-red-500">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label
                    htmlFor="message"
                    className="font-display font-semibold text-[#131314] text-[18px] mb-2"
                  >
                    Message
                  </label>
                  <input
                    id="message"
                    type="text"
                    placeholder="Type message"
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    disabled={isBusy}
                    aria-label="Message"
                    aria-invalid={!!fieldErrors.message}
                    className={cn(
                      "w-full bg-transparent border-b pb-2 text-[16px] text-[#272829] placeholder:text-[#B4B6B8] outline-none transition-colors disabled:opacity-60",
                      fieldErrors.message
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#DCDDE0] focus:border-[#7E60E8]",
                    )}
                  />
                  {fieldErrors.message && (
                    <p role="alert" className="mt-1.5 text-sm text-red-500">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Status feedback */}
                {statusMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "text-sm font-medium text-center",
                      status === "success" && "text-emerald-600",
                      status === "error" && "text-red-500",
                    )}
                  >
                    {statusMessage}
                  </p>
                )}

                {/* Submit Button */}
                <div className="flex justify-start mt-2">
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="font-body cursor-pointer text-white bg-[#7E60E8] hover:bg-[#6D4DE0] font-semibold text-[16px] px-10 py-3 rounded-full transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isBusy ? "Sending…" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
