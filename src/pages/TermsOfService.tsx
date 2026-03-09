import { Link } from 'react-router-dom'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Footer } from '@/components/sections/Footer/Footer'

export function TermsOfService() {
    return (
        <>
            <Navbar />
            <article className="min-h-screen w-full bg-surface-neutral text-content-primary">
                <div className="mx-auto w-full max-w-(--width-container) px-container-x py-16 lg:py-24">
                    <div className="max-w-3xl">
                        <h1 className="font-display text-display-sm lg:text-display-md text-content-primary mb-4">
                            Terms of Service
                        </h1>
                        <p className="font-body text-body-lg text-content-secondary mb-12">
                            Last updated: March 9, 2025
                        </p>

                        <div className="font-body text-body-md text-content-primary space-y-8">
                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    1. Acceptance of Terms
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    By accessing or using the Bonotech.io website and services, you agree to be bound by
                                    these Terms of Service. If you do not agree to these terms, please do not use our
                                    services.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    2. Description of Services
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    Bonotech provides digital product development services including but not limited to
                                    MVP development, mobile and web applications, website development, custom AI
                                    solutions, and UI/UX design. The scope of any specific engagement will be defined in
                                    a separate agreement or statement of work.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    3. User Responsibilities
                                </h2>
                                <p className="text-content-secondary leading-7 mb-4">
                                    You agree to provide accurate information, use our services only for lawful
                                    purposes, and not to interfere with or disrupt the integrity of our systems or
                                    other users. You are responsible for maintaining the confidentiality of any
                                    account credentials and for all activity under your account.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    4. Intellectual Property
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    Unless otherwise agreed in writing, intellectual property rights in deliverables
                                    created as part of a paid engagement will be transferred to you upon full payment.
                                    Bonotech retains rights to its pre-existing tools, methodologies, and generic
                                    components. Our website content, branding, and materials remain our property.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    5. Limitation of Liability
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    To the maximum extent permitted by law, Bonotech shall not be liable for any
                                    indirect, incidental, special, consequential, or punitive damages arising from your
                                    use of our services. Our total liability for any claim shall not exceed the amount
                                    paid by you for the relevant service in the twelve months preceding the claim.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    6. Changes to Terms
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    We may update these Terms of Service from time to time. We will post the updated
                                    terms on this page and update the “Last updated” date. Continued use of our services
                                    after changes constitutes acceptance of the revised terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-display text-heading-lg text-content-primary mb-3">
                                    7. Contact
                                </h2>
                                <p className="text-content-secondary leading-7">
                                    For questions about these Terms of Service, please contact us at{' '}
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
