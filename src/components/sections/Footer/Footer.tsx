import bonotechLogo from "@/assets/bonotech-logo.svg";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer
            id="footer"
            aria-label="Bonotech footer"
            className="relative isolate overflow-hidden bg-[#12091D] px-4 pb-6 pt-16 text-[#F7F0FF] sm:px-6 sm:pt-20 lg:px-8"
        >
            {/* Background atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 bg-[#12091D]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[45%] -z-10 h-[90%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(76,36,112,0.20)_0%,rgba(48,24,72,0.13)_40%,transparent_72%)] blur-[70px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[130px] bg-gradient-to-b from-[#09060E] via-[#0D0714]/75 to-transparent"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[120px] bg-gradient-to-t from-[#09060E] via-[#0D0714]/55 to-transparent"
            />

            {/* Main panel */}
            <div className="mx-auto w-full max-w-[1360px] overflow-hidden rounded-[5px] border border-[#EEE1FF]/25 bg-[linear-gradient(135deg,rgba(241,230,255,0.14),rgba(205,180,249,0.04)_45%,rgba(27,16,43,0.27)),rgba(22,12,40,0.54)] shadow-[inset_0_1px_0_rgba(255,244,255,0.21),inset_0_-1px_0_rgba(222,196,251,0.08),0_14px_50px_rgba(6,2,14,0.30)] backdrop-blur-[26px] backdrop-saturate-[1.3]">
                {/* Top area */}
                <div className="grid grid-cols-1 gap-10 px-6 py-8 sm:px-8 sm:py-10 md:grid-cols-2 lg:grid-cols-[1.12fr_.86fr_1fr_1.02fr] lg:gap-[44px] lg:px-12 lg:py-12">
                    {/* Brand */}
                    <div className="min-w-0">
                        <a
                            href="#home"
                            aria-label="Bonotech — back to home"
                            className="inline-flex"
                        >
                            <img
                                src={bonotechLogo}
                                alt="Bonotech"
                                className="h-auto w-[205px] max-w-full"
                            />
                        </a>

                        <p className="mt-4 max-w-[26ch] text-[16px] font-light leading-[1.65] tracking-[-0.045em] text-[#D4C5E0] sm:text-[17px]">
                            Building innovative digital products that help businesses
                            transition into the age of AI
                        </p>
                    </div>

                    {/* Explore */}
                    <nav
                        aria-labelledby="footer-explore-title"
                        className="min-w-0"
                    >
                        <h2
                            id="footer-explore-title"
                            className="mb-5 text-[11px] font-semibold uppercase leading-[1.5] tracking-[0.105em] text-[#EBDDF6]"
                        >
                            Explore
                        </h2>

                        <ul className="flex list-none flex-col items-start gap-[15px] p-0">
                            <li>
                                <a
                                    href="#about-bonotech"
                                    className="text-[12px] leading-[1.6] tracking-[-0.025em] text-[#CBB9DB] transition-colors hover:text-[#FFF3FF]"
                                >
                                    About Bonotech
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#business-scopes"
                                    className="text-[12px] leading-[1.6] tracking-[-0.025em] text-[#CBB9DB] transition-colors hover:text-[#FFF3FF]"
                                >
                                    Our Service Scope
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#delivery-times"
                                    className="text-[12px] leading-[1.6] tracking-[-0.025em] text-[#CBB9DB] transition-colors hover:text-[#FFF3FF]"
                                >
                                    Average Delivery Times
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#our-technology"
                                    className="text-[12px] leading-[1.6] tracking-[-0.025em] text-[#CBB9DB] transition-colors hover:text-[#FFF3FF]"
                                >
                                    Our Technology
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#client-testimonials"
                                    className="text-[12px] leading-[1.6] tracking-[-0.025em] text-[#CBB9DB] transition-colors hover:text-[#FFF3FF]"
                                >
                                    Client Testimonials
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#discovery-call"
                                    className="group inline-flex items-center text-[12px] font-semibold leading-[1.6] tracking-[-0.025em] text-[#E0BAFF] transition-colors hover:text-white"
                                >
                                    Book a Discovery Call
                                    <span
                                        aria-hidden="true"
                                        className="ml-1 transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                                    >
                                        ↗
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div className="min-w-0">
                        <h2 className="mb-5 text-[11px] font-semibold uppercase leading-[1.5] tracking-[0.105em] text-[#EBDDF6]">
                            Get in Touch
                        </h2>

                        <a
                            href="mailto:contact@bonotech.io"
                            className="block w-fit break-all text-[14px] font-medium text-[#EAD2FC] transition-colors hover:text-white sm:text-[15px]"
                        >
                            contact@bonotech.io
                        </a>

                        <a
                            href="tel:+447551829217"
                            className="mt-[10px] inline-block text-[12px] leading-[1.6] tracking-[-0.025em] text-[#CBB9DB] transition-colors hover:text-white"
                        >
                            +44 7551 829217
                        </a>

                        <address className="mt-7 flex flex-col gap-[5px] text-[11px] not-italic leading-[1.6] tracking-[-0.015em] text-[#C7B5D7]">
                            <strong className="mb-1 text-[10px] font-semibold tracking-[0.005em] text-[#DFCFEA]">
                                BONOTECH HOLDINGS PTE. LTD.
                            </strong>

                            <span>111 SOMERSET ROAD #08-10A</span>
                            <span>Singapore 238164</span>
                        </address>
                    </div>

                    {/* Newsletter */}
                    <div className="min-w-0">
                        <h2
                            id="footer-newsletter-title"
                            className="mb-5 text-[11px] font-semibold uppercase leading-[1.5] tracking-[0.105em] text-[#EBDDF6]"
                        >
                            Stay in the Loop
                        </h2>

                        <p className="mb-3 text-[24px] font-medium leading-[1.15] tracking-[-0.055em] text-[#F1E2FF]">
                            Fresh Thinking
                            <br />
                            Practical Tech
                        </p>

                        <p className="mb-[18px] max-w-[29ch] text-[12px] leading-[1.65] tracking-[-0.015em] text-[#C7B5D7]">
                            Product insights, smarter systems, and AI that works for
                            business
                        </p>

                        <label
                            htmlFor="footer-newsletter-email"
                            className="mb-2 block text-[10px] leading-[1.5] text-[#C6AED8]"
                        >
                            Email address
                        </label>

                        <div className="flex items-center gap-[7px] rounded-[4px] border border-[#CBA9E3]/25 bg-[#160B28]/35 p-1 transition focus-within:border-[#C395ED] focus-within:shadow-[0_0_0_3px_rgba(184,138,219,0.15)]">
                            <input
                                id="footer-newsletter-email"
                                type="email"
                                name="newsletterEmail"
                                autoComplete="email"
                                placeholder="Your email address"
                                aria-describedby="footer-newsletter-note"
                                maxLength={254}
                                className="h-[37px] min-w-0 flex-1 border-0 bg-transparent px-[7px] text-[11px] font-normal tracking-[-0.02em] text-[#F7EDFF] outline-none placeholder:text-[#B39AC8]"
                            />

                            <button
                                type="button"
                                disabled
                                aria-label="Subscribe to the newsletter — coming soon"
                                className="grid h-9 w-9 shrink-0 cursor-not-allowed place-items-center rounded-[4px] bg-[#C19BE9]/10 p-[9px] text-[#B89BCD]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                    className="h-[18px] w-[18px]"
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
                            className="mt-[10px] text-[10px] leading-[1.5] text-[#B49AC8]"
                        >
                            Newsletter signup coming soon
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-5 border-t border-[#D8B9F0]/15 bg-[#160C28]/15 px-6 py-[22px] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
                    {/* Copyright */}
                    <p className="m-0 text-[10px] leading-[1.8] text-[#BFA7D0]">
                        © {currentYear} Bonotech Holdings Pte. Ltd.
                        <span className="block">
                            All rights reserved
                        </span>
                    </p>

                    {/* Back to top */}
                    <button
                        type="button"
                        onClick={scrollToTop}
                        aria-label="Back to top"
                        className="group flex w-fit items-center gap-2 py-2 text-[10px] tracking-[0.015em] text-[#CEB3E2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B4FC]"
                    >
                        <span>Back to Top</span>

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                            className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-translate-y-[3px]"
                        >
                            <path
                                d="M12 19V5m-6 6 6-6 6 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {/* Socials */}
                    <nav
                        aria-label="Follow Bonotech"
                        className="flex items-center gap-2"
                    >
                        {[
                            {
                                label: "X",
                                href: "https://x.com/bonotechpteltd",
                                aria: "Bonotech on X",
                            },
                            {
                                label: "IG",
                                href: "https://www.instagram.com/bonotechpteltd",
                                aria: "Bonotech on Instagram",
                            },
                            {
                                label: "FB",
                                href: "https://www.facebook.com/bonotechpteltd",
                                aria: "Bonotech on Facebook",
                            },
                            {
                                label: "LI",
                                href: "https://www.linkedin.com/company/bonotechpteltd",
                                aria: "Bonotech on LinkedIn",
                            },
                        ].map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${social.aria} (opens in a new tab)`}
                                className="group relative isolate grid h-[42px] w-[42px] place-items-center overflow-hidden rounded-full border border-[#DBC4F0]/25 text-[11px] font-medium text-[#E1C9F1] transition duration-300 hover:border-[#C797EF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B4FC]"
                            >
                                <span className="absolute inset-0 -z-10 translate-y-[105%] rounded-full bg-[#642EAA] transition-transform duration-500 ease-out group-hover:translate-y-0" />

                                <span>
                                    {social.label}
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Bottom breathing space */}
            <div
                aria-hidden="true"
                className="h-[54px] sm:h-[60px] lg:h-[76px]"
            />
        </footer>
    );
};

export default Footer;
