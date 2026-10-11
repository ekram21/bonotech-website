import Footer from '@/shared/Footer/Footer'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/usePageMeta'

const TITLE = 'Privacy Policy — Bonotech'
const DESCRIPTION = 'How Bonotech Holdings Pte. Ltd. collects, uses and protects your information.'

const sectionClass =
    'rounded-2xl border border-border-primary/80 bg-surface-white/60 p-8 sm:p-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]'

export function PrivacyPolicy() {
    usePageMeta(TITLE, DESCRIPTION)

    return (
        <>
            <article id="main-content" tabIndex={-1} className="min-h-screen w-full bg-surface-neutral text-content-primary">
                <div className="mx-auto w-full max-w-(--width-container) px-container-x pt-32 pb-16 lg:pt-40 lg:pb-24">
                    <header className="max-w-3xl mb-12 lg:mb-16">
                        <p className="font-body text-label-lg text-content-tertiary uppercase tracking-wider mb-3">
                            Bonotech Holdings Pte. Ltd.
                        </p>
                        <h1 className="font-display text-display-sm lg:text-display-md text-content-primary text-balance mb-4">
                            Privacy Policy
                        </h1>
                        <p className="font-body text-body-lg text-content-secondary">
                            This Privacy Policy explains how we handle your information when you use our websites and
                            services.
                        </p>
                    </header>

                    <div className="max-w-3xl space-y-8 font-body text-body-md">
                        <section className={sectionClass} aria-labelledby="privacy-collect">
                            <h2
                                id="privacy-collect"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Information We Collect and How We Use It
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Bonotech Holdings Pte. Ltd. values your privacy and is fully committed to protecting the
                                information you share on our website. We never sell or give your information to outside
                                parties unless required by law. We collect information to meet your needs and respond to
                                your requests.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-security">
                            <h2
                                id="privacy-security"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Data Security Compliance
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Keeping your data safe and secure is central to how Bonotech Holdings Pte. Ltd. operates.
                                This statement sets out our commitment to information and data security. We are
                                committed to protecting your privacy online and understand that any personally
                                identifiable information (“Personal Information”) you provide to us must be handled
                                securely. We continually work to improve our privacy practices.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-logs">
                            <h2
                                id="privacy-logs"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Collecting User Information
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                We collect some information about website visitors indirectly through our internet
                                access logs. When you visit our website, your browser’s domain name and IP address are
                                automatically recorded in these logs. We use this information to understand which
                                sections, pages and information visitors view.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-personal">
                            <h2
                                id="privacy-personal"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Use of Personal Information
                            </h2>
                            <div className="text-content-secondary leading-[1.75] space-y-4">
                                <p>
                                    If you give us your phone number, you agree to receive text messages from Bonotech
                                    Holdings Pte. Ltd. Message frequency varies, and message and data rates may apply
                                    if you reply.
                                </p>
                                <p>
                                    Personal information is any information that can be used to identify an individual.
                                    This includes, but is not limited to, first and last names, physical addresses,
                                    email addresses and other contact details, whether personal or work-related. In
                                    general, you can browse our websites without identifying yourself or sharing any
                                    personal information.
                                </p>
                                <p>
                                    If you choose to share personal information with us online, we may transfer it from
                                    your country or jurisdiction to other countries or jurisdictions, within Bonotech
                                    Holdings Pte. Ltd. or to our third-party service providers.
                                </p>
                                <p>
                                    We make every effort to follow all relevant international regulations that protect
                                    your privacy. Even if we transfer your Personal Information to a country whose laws
                                    offer a different level of protection, we remain committed to the principles in this
                                    Privacy Policy.
                                </p>
                            </div>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-cookies">
                            <h2
                                id="privacy-cookies"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Cookies
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Our website may use cookies to produce overall site traffic statistics. Cookies cannot
                                identify you on their own unless you choose to identify yourself. If you prefer, you can
                                disable cookies in your browser’s settings.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-disclosure">
                            <h2
                                id="privacy-disclosure"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Disclosure of User Information
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Bonotech Holdings Pte. Ltd. does not rent, sell or disclose your personal information to
                                other businesses or unaffiliated parties. If you send us information by email, we only
                                share it with members of our management team who are responsible for responding to your
                                request.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-disclose-circumstances">
                            <h2
                                id="privacy-disclose-circumstances"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                When We May Disclose Information
                            </h2>
                            <ul className="text-content-secondary leading-[1.75] list-disc pl-5 space-y-3">
                                <li>
                                    To trusted partners who work for or with Bonotech Holdings Pte. Ltd., under strict
                                    confidentiality agreements.
                                </li>
                                <li>
                                    To respond to subpoenas, court orders or legal proceedings, or to establish,
                                    exercise or defend our legal rights.
                                </li>
                                <li>
                                    When we believe disclosure is necessary to investigate, prevent or take action
                                    against illegal activity, suspected fraud or situations that could threaten
                                    someone’s physical safety, or when otherwise required by law.
                                </li>
                            </ul>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-external">
                            <h2
                                id="privacy-external"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Links to External Websites
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Our website may contain links to third-party websites. Bonotech Holdings Pte. Ltd. is not
                                responsible for the policies or content of those websites. These links are provided for
                                your convenience only, and we accept no liability for any inaccurate information on
                                them. Some of these websites may collect data, ask for personal information or set their
                                own cookies. We make no guarantees about the availability, accuracy or completeness of
                                any linked third-party website.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-ip">
                            <h2
                                id="privacy-ip"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Intellectual Property
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Bonotech Holdings Pte. Ltd. or third parties may hold intellectual property rights in
                                the products, technology and services described on this website. Nothing in this policy
                                grants you any license, title or ownership of any intellectual property rights of
                                Bonotech Holdings Pte. Ltd. or any third party, whether by implication, estoppel or
                                otherwise.
                            </p>
                        </section>

                        <p className="font-body text-body-md text-content-tertiary pt-4">
                            Questions? Contact us at{' '}
                            <a
                                href="mailto:contact@bonotech.io"
                                className="text-content-primary underline underline-offset-2 hover:no-underline"
                            >
                                contact@bonotech.io
                            </a>
                            .
                        </p>

                        <p className="font-body text-body-md text-content-tertiary">
                            <Link
                                to="/terms"
                                className="text-content-primary underline underline-offset-2 hover:no-underline mr-4"
                            >
                                Terms and Conditions
                            </Link>
                            <Link to="/" className="text-content-primary underline underline-offset-2 hover:no-underline">
                                ← Back to home
                            </Link>
                        </p>
                    </div>
                </div>
            </article>
            <Footer />
        </>
    )
}
