import { Link } from 'react-router-dom'
import Footer from '@/shared/Footer/Footer'
import { usePageMeta } from '@/lib/usePageMeta'

const TITLE = 'Terms and Conditions — Bonotech'
const DESCRIPTION = 'The terms and conditions for Bonotech Holdings Pte. Ltd. services.'

const sectionClass =
    'rounded-2xl border border-border-primary/80 bg-surface-white/60 p-8 sm:p-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]'

export function TermsOfService() {
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
                            Terms and Conditions
                        </h1>
                        <p className="font-body text-body-lg text-content-secondary">
                            Please read these terms carefully. Our{' '}
                            <Link
                                to="/privacy"
                                className="text-content-primary underline underline-offset-2 hover:no-underline"
                            >
                                Privacy Policy
                            </Link>{' '}
                            explains how we handle personal information.
                        </p>
                    </header>

                    <div className="max-w-3xl space-y-8 font-body text-body-md">
                        <section className={sectionClass} aria-labelledby="terms-agreement">
                            <h2
                                id="terms-agreement"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Agreement
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                This agreement begins when the Client enrolls in the services of Bonotech Holdings Pte.
                                Ltd. (the “Company”) and remains in effect until either party ends it in line with these
                                terms and conditions.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-description">
                            <h2
                                id="terms-description"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Description of Service
                            </h2>
                            <div className="text-content-secondary leading-[1.75] space-y-4">
                                <p>The Company may provide the Client with one or more of the following services:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Accelerated MVP development</li>
                                    <li>Mobile application development</li>
                                    <li>Web application development</li>
                                    <li>Website design and development</li>
                                    <li>User experience and interface design</li>
                                    <li>Custom AI solutions</li>
                                    <li>Other customized technology services</li>
                                </ul>
                                <p>
                                    Unless explicitly stated otherwise, any new feature that adds to or enhances the
                                    services is considered part of the Company’s services.
                                </p>
                                <p>
                                    The Company reserves the right, at any time and without notice, to change, suspend
                                    or end the services (or any part of them) due to the Client’s non-cooperation,
                                    non-payment or unreasonable delay. The Client acknowledges that the Company and its
                                    suppliers will not be held responsible for any losses, damages or consequences
                                    resulting from the change, suspension or ending of the services.
                                </p>
                            </div>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-access">
                            <h2
                                id="terms-access"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Access to Information
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                In this agreement, “Company Websites” means all websites owned, operated or hosted by or
                                on behalf of the Company. To access the Company Websites or services, the Client may be
                                asked to provide additional information or registration details. The Client must provide
                                accurate, current and complete information to use the services or access the Company
                                Websites. The Company may deny the Client access to any Company Websites, services or
                                resources, or suspend or cancel the Client’s account at any time, if it finds that the
                                information provided is inaccurate, outdated or incomplete.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-ip-info">
                            <h2
                                id="terms-ip-info"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Intellectual Property Information
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                All product names, trademarks and registered trademarks mentioned on this website belong
                                to their respective owners. They are used for identification and information purposes
                                only. Any mention of a business, product or service does not imply sponsorship,
                                endorsement or partnership with those brands. Unless otherwise stated, we respect all
                                intellectual property rights and claim no affiliation with the brands mentioned. We
                                state this to be transparent and to protect the rights of our users and the trademark
                                owners.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-payments">
                            <h2
                                id="terms-payments"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Payments
                            </h2>
                            <div className="text-content-secondary leading-[1.75] space-y-6">
                                <div>
                                    <h3 className="font-display text-title-lg text-content-primary mb-3">
                                        Payment for Products
                                    </h3>
                                    <p>
                                        If the Client buys a product, the full amount must be paid upfront using the
                                        payment method agreed with the sales representative. If necessary, the Company
                                        may ask for documents to confirm that the Client is the cardholder and is
                                        authorized to pay on behalf of the business or individual. The Client agrees to
                                        provide these documents on request. This is required by law and by the
                                        Company’s security compliance procedures.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-display text-title-lg text-content-primary mb-3">
                                        Payment for Services
                                    </h3>
                                    <p>
                                        If the Client chooses our services, payment is due according to the milestones
                                        set out in the contract, using the payment method agreed with the sales
                                        representative. To protect both parties from payment fraud, the Company may
                                        request documents, where applicable, to confirm that the Client is the
                                        cardholder and is authorized to pay on behalf of the business or individual.
                                    </p>
                                    <p className="mt-4">
                                        By choosing our services and products, the Client agrees to our business
                                        policies. If the Client is not fully satisfied with our products or services,
                                        they may{' '}
                                        <strong className="text-content-primary font-medium">
                                            request a refund within 7 days of payment
                                        </strong>
                                        . Any changes or updates already completed must still be paid for.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-cancellation">
                            <h2
                                id="terms-cancellation"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Cancellation &amp; Refund Policy
                            </h2>
                            <div className="text-content-secondary leading-[1.75] space-y-4">
                                <p>
                                    The Client must pay the Company in full for any services provided before the
                                    confirmed cancellation date. Cancellation requests made more than seven days after
                                    the order date are not eligible for a refund, whatever the reason. Only written
                                    cancellation requests from the original authorized party will be accepted.
                                </p>
                                <p>
                                    Conversations with our representatives or offices, whether by phone, email,
                                    WhatsApp, Skype or any other channel, may be recorded for security and training
                                    purposes. These recordings form part of the agreement between the Client and the
                                    Company.
                                </p>
                            </div>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-proprietary">
                            <h2
                                id="terms-proprietary"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Proprietary Information
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                The content on this website, and on any other website the Company owns, operates,
                                licenses or controls, is the property of the Company or of the person who supplied it.
                                The Company or the content provider keeps all rights, title and interest in this
                                content. Without the Company’s prior written permission, the content may not be copied,
                                distributed, republished, uploaded, posted or transmitted in any form. However, the
                                Client may print a copy for their own internal use. Clients may not remove or alter, or
                                cause to be removed or altered, any copyright, trademark, trade name, service mark or
                                other proprietary notice that appears on the content. The content may not be modified or
                                used unless these terms specifically allow it. Access to the services or Company
                                Websites does not give the Client any ownership or intellectual property rights. Nothing
                                in this agreement limits the ability of the Company’s suppliers to provide their
                                services, websites or technology to any third party, or affects the rights given to
                                those third parties.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-submissions">
                            <h2
                                id="terms-submissions"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Submissions
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                The Client gives the Company a royalty-free, perpetual, irrevocable, worldwide,
                                non-exclusive right and license to use, reproduce, modify, adapt, publish, translate,
                                create derivative works from, distribute, perform and display any content, comments,
                                suggestions, ideas, graphics or other information sent to the Company through this
                                website (together, the “Submission”), and to include any Submission in other works in
                                any form, media or technology now known or developed later. The Company is not required
                                to treat any Submission as confidential and may use it in its business (including for
                                products or advertising) without paying royalties or any other compensation. The
                                Company is also not liable for any similarities that may appear in its future work.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-external">
                            <h2
                                id="terms-external"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                External Sites
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                This website may link to external websites that are not related to or maintained by the
                                Company. These links are provided for convenience and do not mean the Company sponsors
                                or is associated with those websites. The Company is not responsible for their content
                                and has not reviewed all of them. The Client uses these links at their own risk. The
                                Company makes no guarantees about the accuracy, completeness or content of linked
                                websites, and a link does not mean the Company endorses the website.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-liability">
                            <h2
                                id="terms-liability"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Limitation of Liability
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                The Client understands and agrees that the Company and its officers, employees, agents,
                                partners and licensors will not be liable for any direct, indirect, incidental,
                                special, consequential or exemplary damages. This includes, but is not limited to,
                                damages for lost profits, goodwill, use, data or other intangible losses (even if the
                                Company has been told such damages are possible) resulting from the use of, or inability
                                to use, the services, the cost of buying substitute goods and services, or any other
                                matter relating to the services.
                            </p>
                        </section>

                        <p className="font-body text-body-md text-content-tertiary pt-4">
                            For questions about these Terms and Conditions, contact us at{' '}
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
                                to="/privacy"
                                className="text-content-primary underline underline-offset-2 hover:no-underline mr-4"
                            >
                                Privacy Policy
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
