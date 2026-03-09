import { Link } from 'react-router-dom'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Footer } from '@/components/sections/Footer/Footer'

export function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <article className="min-h-screen w-full bg-surface-neutral text-content-primary">
                <div className="mx-auto w-full max-w-(--width-container) px-container-x py-16 lg:py-24">
                    <div className="max-w-3xl">
                        <h1 className="font-display text-display-sm lg:text-display-md text-content-primary mb-4">
                            Privacy Policy
                        </h1>
                        <p className="font-body text-body-lg text-content-secondary mb-12">
                            Last updated: March 9, 2025
                        </p>

                        <div className="font-body text-body-md text-content-primary space-y-8">
                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    1. Introduction
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    Bonotech (“we”, “our”, or “us”) is committed to protecting your privacy. This
                                    Privacy Policy explains how we collect, use, disclose, and safeguard your
                                    information when you visit our website or use our services.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    2. Information We Collect
                                </h2>
                                <p className="text-content-secondary leading-7 mb-4">
                                    We may collect information you provide directly (e.g. name, email, company, message
                                    content when you contact us), information collected automatically (e.g. IP address,
                                    browser type, device information, pages visited), and information from cookies and
                                    similar technologies where applicable.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    3. How We Use Your Information
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    We use the information we collect to respond to your inquiries, deliver and
                                    improve our services, send relevant communications, analyze site usage, prevent
                                    fraud, and comply with legal obligations. We do not sell your personal information
                                    to third parties.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    4. Sharing of Information
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    We may share your information with service providers who assist us in operating our
                                    website and business (e.g. hosting, analytics, email delivery), when required by
                                    law, or to protect our rights and safety. We require such providers to protect
                                    your information in line with this policy.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    5. Data Retention and Security
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    We retain your information only as long as necessary to fulfill the purposes
                                    described in this policy or as required by law. We implement appropriate
                                    technical and organizational measures to protect your personal information against
                                    unauthorized access, alteration, disclosure, or destruction.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    6. Your Rights
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    Depending on your location, you may have rights to access, correct, delete, or
                                    restrict processing of your personal data, or to object to certain processing and
                                    to data portability. To exercise these rights, please contact us at the email
                                    address below.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    7. Contact Us
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    For any questions about this Privacy Policy or our data practices, please contact
                                    us at{' '}
                                    <a
                                        href="mailto:contact@bonotech.io"
                                        className="text-content-primary underline hover:no-underline"
                                    >
                                        contact@bonotech.io
                                    </a>
                                    .
                                </p>
                            </section>
                        </div>

                        <p className="mt-12 font-body text-body-md text-content-tertiary">
                            <Link to="/" className="text-content-primary underline hover:no-underline">
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
