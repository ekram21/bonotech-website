import { Link } from 'react-router-dom'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Footer } from '@/components/sections/Footer/Footer'

const sectionClass =
    'rounded-2xl border border-border-primary/80 bg-surface-white/60 p-8 sm:p-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]'

export function TermsOfService() {
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
                                The client&apos;s enrollment in Bonotech Pte. Ltd. services marks the beginning of the
                                terms of the agreement, which will expire when either party terminates it in line with
                                the terms and conditions.
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
                                <p>The company may provide the Client with one or more of the following services:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Accelerated MVP development</li>
                                    <li>Mobile application development</li>
                                    <li>Web application development</li>
                                    <li>Website design and development</li>
                                    <li>User experience/interface design</li>
                                    <li>Custom AI solutions</li>
                                </ul>
                                <p>
                                    Other customized technology services. Unless explicitly stated otherwise, any
                                    addition of a new feature that augments or enhances the Services shall be
                                    considered to be part of the Bonotech Pte. Ltd. Services.
                                </p>
                                <p>
                                    The company retains the right, at any time and without warning, to alter, suspend,
                                    or terminate the services (or any portion of them) due to client non-cooperation,
                                    nonpayment, or undesired delay. The client specifically acknowledges that the company
                                    and its suppliers will not be held responsible for any losses, damages, or
                                    repercussions resulting from the modification, suspension, or termination of the
                                    services.
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
                                All websites owned, run, or hosted by, on behalf of, or for Company are referred to
                                herein as the Company Websites for the purposes of the Agreement. To gain access to the
                                company&apos;s websites or services the client can be requested to supply more
                                information or specific registration data. Clients must supply accurate, up-to-date, and
                                comprehensive information in order to use the services or access the company websites.
                                The company has the right to deny the client access to any company websites, services,
                                or resources, as well as to suspend or cancel the client&apos;s account at any time, if
                                it determines that the information the client has provided is inaccurate, outdated, or
                                incomplete.
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
                                The owners of any product names, trademarks, and registered trademarks referenced on
                                this website are the exclusive owners. These names are only used for identifying and
                                informational purposes. Any mention of a business, good, or service does not imply
                                sponsorship, endorsement, or collaboration with the corresponding brands. Unless
                                otherwise indicated, we respect all intellectual property rights and disclaim any
                                affiliation with the brands mentioned. In order to provide transparency and protect the
                                rights of both our users and the trademark owners, we seek to clarify the relationship
                                between our material and third-party trademarks.
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
                                        Payment For Product
                                    </h3>
                                    <p>
                                        If a customer decides to buy a product, they must make the whole amount upfront.
                                        As agreed upon with the sales representative, the client must use the same
                                        payment method. If necessary, the firm may ask for documentation to verify that
                                        the customer is the cardholder and has the authority to make the payment on the
                                        company&apos;s or individual&apos;s behalf. The customer consents to provide
                                        these records upon request. These are mandated by law and in line with the
                                        company&apos;s security compliance protocols.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-display text-title-lg text-content-primary mb-3">
                                        Payment For Services
                                    </h3>
                                    <p>
                                        If the client decides to go for our services, then he/she has to pay as per the
                                        milestones that have been introduced in the contractual agreement. The client
                                        has to pay in the same payment method, as discussed with the sales agent. In the
                                        interests of security and to safeguard both parties from payment frauds, Company
                                        may request documents if applicable, to ensure that the client is the cardholder
                                        and authorized to make the payment on behalf of the business or individual.
                                    </p>
                                    <p className="mt-4">
                                        By opting to our services and products, you are obliging to the policies of our
                                        business and industry. If for any reason you are not entirely satisfied with our
                                        Product/Services then you can request for{' '}
                                        <strong className="text-content-primary font-medium">
                                            refund within 7 days from the payment
                                        </strong>
                                        . If there are any changes made or updates are done, the amount has to be paid
                                        for that part (work done).
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-cancellation">
                            <h2
                                id="terms-cancellation"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Cancellation &amp; Refunds Policy
                            </h2>
                            <div className="text-content-secondary leading-[1.75] space-y-4">
                                <p>
                                    The client must pay the company in full for any services supplied before the
                                    confirmed cancelation date. Any cancellation requests made after seven days from the
                                    order date will not be eligible for a refund. Conversations with our representatives
                                    or offices, whether via phone, email, WhatsApp, Skype, or any other form of contact,
                                    may be digitally recorded for security and training purposes. The recordings are
                                    included in the contract between the client and the company. There will be no
                                    reimbursements for any cancellations made after the seven-day window for whatever
                                    reason. Only requests for cancellation submitted in writing by the original
                                    authorized party will be fulfilled.
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
                                The information available on this website and any other website that the company owns,
                                operates, licenses, or controls is proprietary to the company or the person who supplied
                                it. All rights, title, and interest in the material are retained by the Company or the
                                content provider. Without the Company&apos;s prior written authorization, the Content
                                may not be copied, distributed, republished, uploaded, posted, or transmitted in any
                                form; however, the Client may print a copy of the Content for their own internal use. Any
                                copyright, trademark, trade name, service mark, or other property notice or legend that
                                appears on any of the Content may not be removed, altered, or caused to be removed by
                                clients. It is forbidden to modify or use the content unless specifically permitted by
                                these terms and conditions. Access to the Services or Company Websites does not grant
                                the Client any ownership or intellectual property rights. Nothing in this agreement will
                                be interpreted as restricting or limiting Company suppliers&apos; ability to provide
                                their services, Company websites, or technology to any third party for any reason or in
                                any way affecting the rights given to such other third parties. No user may interpret
                                their usage of any of the Services or Company Websites as giving them any kind of
                                intellectual property rights.
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
                                Client hereby gives Company the royalty-free, perpetual, irrevocable, worldwide,
                                non-exclusive right and license to use, reproduce, modify, adapt, publish, translate,
                                create derivative works from, distribute, perform, and display any content, remarks,
                                suggestions, ideas, graphics, or other information communicated to Company through this
                                site (collectively, the Submission), and to incorporate any Submission in other works in
                                any form, media, or technology now known or later developed. The company will not be
                                obligated to treat any submission as confidential, and it may use any submission in its
                                operations (including, but not limited to, for products or advertising) without being
                                liable for royalties or any other kind of consideration. Additionally, the company will
                                not be liable for any similarities that may arise in future business operations.
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
                                There may be hyperlinks from this website to other external websites that are unrelated
                                to or not maintained by the company. Hyperlinks to these websites are offered to users
                                as a service and are not associated with or sponsored by this website or business. The
                                business is not accountable for the content of these websites and has not examined any or
                                all of them. The client is responsible for using hyperlinks at their own risk, and the
                                company offers no guarantees or representations regarding the correctness, completeness,
                                or content of these hyperlinks or the websites they lead to. Furthermore, the company
                                does not necessarily support any hyperlink to a third-party website.
                            </p>
                        </section>

                        <section className={sectionClass} aria-labelledby="terms-liability">
                            <h2
                                id="terms-liability"
                                className="font-display text-heading-lg text-content-primary mb-4 pb-3 border-b border-border-primary"
                            >
                                Limitations of Liability
                            </h2>
                            <p className="text-content-secondary leading-[1.75]">
                                The client expressly understands and consents that the company and its officers,
                                employees, agents, partners, and licensors will not be liable to the client for any
                                direct, indirect, incidental, special, consequential, or exemplary damages, including but
                                not limited to damages for lost profits, goodwill, use, data, or other intangible losses
                                (even if the company has been informed of the possibility of such damages), resulting
                                from the use or incapacity to use the service, or the cost of purchasing substitute
                                goods and services, or any other matter relating to the service.
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
