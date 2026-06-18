import { Link } from 'react-router-dom'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Footer } from '@/components/sections/Footer/Footer'

const sectionClass =
    'rounded-2xl border border-border-primary/80 bg-surface-white/60 p-8 sm:p-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]'

export function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <article className="min-h-screen w-full bg-surface-neutral text-content-primary">
                <div className="mx-auto w-full max-w-(--width-container) px-container-x pt-32 pb-16 lg:pt-40 lg:pb-24">
                    <header className="max-w-3xl mb-12 lg:mb-16">
                        <p className="font-body text-label-lg text-content-tertiary uppercase tracking-wider mb-3">
                            Bonotech Pte. Ltd.
                        </p>
                        <h1 className="font-display text-display-sm lg:text-display-md text-content-primary text-balance mb-4">
                            Privacy Policy
                        </h1>
                        <p className="font-body text-body-lg text-content-secondary">
                            This Online Privacy Policy describes how we handle information when you use our websites and
                            services.
                        </p>
                    </header>

                    <div className="max-w-3xl space-y-8 font-body text-body-md">
                        <section className={sectionClass} aria-labelledby="privacy-collect">
                            <h2
                                id="privacy-collect"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Information That We Collect and How We Use It
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Bonotech Pte. Ltd. values your privacy and is entirely committed to preserving the data
                                you share on our website. Unless it is mandated by law, we never sell or give user
                                information to outside parties. In order to meet your needs and address your requests
                                for information, we collect user data.
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
                                A key component of Bonotech Pte. Ltd.&apos;s business operations is the safety and
                                security of your data. This declaration gives our clients assurance about our dedication
                                to information and data security compliance. Bonotech Pte. Ltd. has a commitment to
                                guaranteeing your online privacy and understands that any personally identifiable data
                                (also known as &quot;Personal Information&quot;) you provide with us must be securely
                                handled and secured. The company is constantly working to improve its privacy policy.
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
                                Through our Internet access logs, we indirectly gather data on our website users. The
                                domain name and IP address of your browser are automatically gathered and added to our
                                Internet access records when you visit Bonotech Pte. Ltd. We utilize this data to
                                determine which sections, pages, and information visitors to the website access.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-personal">
                            <h2
                                id="privacy-personal"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Usage Of Personal Information
                            </h2>
                            <div className="text-content-secondary leading-[1.75] space-y-4">
                                <p>
                                    You consent to receiving text messages from Bonotech Pte. Ltd. by giving your phone
                                    number. Message or data fees may apply if you want to respond. The frequency of
                                    messages varies.
                                </p>
                                <p>
                                    Any information that can be used to identify an individual is considered personal
                                    information. This includes, but is not limited to, first and last names, physical
                                    addresses, email addresses, and other contact details, whether at home or at work.
                                    Generally speaking, you can access Bonotech Pte. Ltd. websites without identifying
                                    yourself or disclosing any personal information.
                                </p>
                                <p>
                                    If you decide to give us your personal information online, we may transfer data from
                                    your country or jurisdiction to other countries or jurisdictions worldwide, within
                                    Bonotech Pte. Ltd. or to Bonotech Pte. Ltd. third-party service providers.
                                </p>
                                <p>
                                    Bonotech Pte. Ltd. makes an effort to abide by all relevant international regulations
                                    that are aimed at protecting your privacy. Bonotech Pte. Ltd. is committed to
                                    upholding the principles stated in this Online Privacy Policy even if, in
                                    connection with the aforementioned, we transfer your Personal Information from your
                                    country to countries that might not require an &quot;adequate&quot; level of
                                    protection for your Personal Information, regardless of the fact that legal
                                    requirements may differ from country to country.
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
                                Cookies may be used by the Bonotech Pte. Ltd. website to help generate overall site traffic
                                statistics. Unless a person explicitly identifies themselves, cookies cannot be used to
                                determine their identify on their own. You can change the settings in your
                                browser&apos;s preferences or options menu to disable cookies on your computer if
                                you&apos;d like.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-disclosure">
                            <h2
                                id="privacy-disclosure"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Disclosure Of User Information
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Bonotech Pte. Ltd. does not rent, sell, or disclose your personal information to
                                businesses or non-affiliated parties. Bonotech Pte. Ltd. protects your privacy if you
                                have sent us user information by email by making sure that it is only shared with
                                members of the Bonotech Pte. Ltd. management, who are all in charge of directly or
                                indirectly responding to your requests.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-disclose-circumstances">
                            <h2
                                id="privacy-disclose-circumstances"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                We May Disclose Information In The Following Circumstances
                            </h2>
                            <ul className="text-content-secondary leading-[1.75] list-disc pl-5 space-y-3">
                                <li>
                                    Under extremely restrictive confidentiality agreements, we give the information to
                                    reliable partners that operate for or with Bonotech Pte. Ltd.
                                </li>
                                <li>
                                    In addition to establishing or exercising our legal rights and defending against
                                    legal claims, we respond to subpoenas, court orders, and legal proceedings.
                                </li>
                                <li>
                                    We feel that information must be shared in order to look into, stop, or take action
                                    about unlawful activity, suspected fraud, circumstances that could endanger
                                    someone&apos;s physical safety, or as otherwise mandated by law.
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
                                Links to other third-party websites may be found on the Bonotech Pte. Ltd. website;
                                however, Bonotech Pte. Ltd. is not liable for the policies or content of these websites.
                                These links are merely for your convenience, and Bonotech Pte. Ltd. disclaims all
                                liability for any inaccurate information found on these websites. In addition to
                                collecting data and requesting personal information, some websites may transmit their own
                                cookies to users. We provide no guarantees for the presence, adequacy, correctness, or
                                completeness of any third-party websites that are linked to by the Bonotech Pte. Ltd.
                                website.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="privacy-ip">
                            <h2
                                id="privacy-ip"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Intellectual property
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                Bonotech Pte. Ltd. or other third parties may reserve intellectual property rights over
                                the goods, technology, and services discussed on this website. Nothing in this
                                document should be interpreted as granting you any license, title, or ownership of any
                                intellectual property rights of Bonotech Pte. Ltd. or any third party, whether by
                                implication, estoppel, or other means.
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
