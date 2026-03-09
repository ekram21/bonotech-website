import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'
import type { FooterProps, FooterLinkGroup } from './Footer.types'
import { FooterBrand } from './components/FooterBrand'
import { FooterLinkColumn } from './components/FooterLinkColumn'
import footerBg from '@/assets/footer-bg.jpg'
import footerLogo from '@/assets/footer-logo.png'

const LINK_GROUPS: FooterLinkGroup[] = [
    {
        title: 'Company',
        links: [
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
            { label: 'FAQs', href: '#faqs' },
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'MVP Development', href: '#' },
            { label: 'Mobile/Web App', href: '#' },
            { label: 'Website Development', href: '#' },
            { label: 'Custom AI Solutions', href: '#', badge: 'NEW' },
            { label: 'UI/UX Design', href: '#' },
        ],
    },
    {
        title: 'Social',
        links: [
            { label: 'Facebook', href: '#' },
            { label: 'LinkedIn', href: '#' },
        ],
    },
]

const BOTTOM_LINKS = [
    { label: '© Bonotech.io', href: '/', internal: true },
    { label: 'Terms of Service', href: '/terms', internal: true },
    { label: 'Privacy Policy', href: '/privacy', internal: true },
]

export function Footer({ className }: FooterProps) {
    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer
            id="footer"
            aria-label="Site footer"
            className={cn('relative w-full overflow-hidden', className)}
        >
            {/* ─── Background Image ─── */}
            <img
                src={footerBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* ─── Dark overlay ─── */}
            <div
                className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.70)_100%)]"
                aria-hidden="true"
            />

            {/* ─── #050113 color overlay ─── */}
            <div
                className="absolute inset-0 z-10 bg-[rgba(5,1,19,0.15)]"
                aria-hidden="true"
            />

            {/* ─── Bottom radial gradient glow ─── */}
            <div
                className="absolute bottom-0 left-0 w-full z-10 h-[55%] bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,#566687_0%,#1F2629_60%,transparent_100%)]"
                aria-hidden="true"
            />

            {/* ─── Content ─── */}
            <div className="relative z-20 mx-auto w-full max-w-(--width-container) px-container-x">
                {/* ─── Main grid: Brand + Link columns ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 pt-20 pb-14">
                    {/* Brand area — left */}
                    <div className="lg:col-span-4">
                        <FooterBrand />
                    </div>

                    {/* Link columns — right */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-8">
                        {LINK_GROUPS.map((group) => (
                            <FooterLinkColumn key={group.title} group={group} />
                        ))}
                    </div>
                </div>

                {/* ─── Gradient divider ─── */}
                <div
                    className="w-full h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0.15)_80%,transparent_100%)]"
                    aria-hidden="true"
                />

                {/* ─── Bottom bar ─── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6">
                    {/* Left — Legal links */}
                    <div className="flex flex-wrap items-center gap-6">
                        {BOTTOM_LINKS.map((link) =>
                            link.internal ? (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="font-body text-[13px] leading-[1.4] font-normal text-white no-underline opacity-45 transition-(--transition-base) hover:opacity-70"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="font-body text-[13px] leading-[1.4] font-normal text-white no-underline opacity-45 transition-(--transition-base) hover:opacity-70"
                                >
                                    {link.label}
                                </a>
                            )
                        )}
                    </div>

                    {/* Right — Back to top */}
                    <button
                        type="button"
                        onClick={handleBackToTop}
                        className="group font-body text-[13px] leading-[1.4] font-normal text-white opacity-45 cursor-pointer bg-transparent border-none gap-1.5 transition-(--transition-base) hover:opacity-100 mt-4 sm:mt-0 inline-flex items-center"
                        aria-label="Scroll back to top"
                    >
                        Back to top
                        <ArrowUp
                            size={14}
                            className="transition-(--transition-fast) group-hover:-translate-y-0.5"
                        />
                    </button>
                </div>
            </div>

            {/* ─── Bottom Logo ─── */}
            <div className="relative z-20 w-full flex items-end justify-center overflow-hidden h-[clamp(100px,16vw,220px)] mt-2">
                <img
                    src={footerLogo}
                    alt="Bonotech.io"
                    className="relative w-full max-w-350 object-cover object-top select-none pointer-events-none"
                />
            </div>
        </footer>
    )
}
