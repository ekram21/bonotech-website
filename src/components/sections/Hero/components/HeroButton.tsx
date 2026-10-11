import { cn } from '@/lib/utils'

interface HeroButtonProps {
    label: string
    href: string
    className?: string
}

export function HeroButton({ label, href, className }: HeroButtonProps) {
    return (
        <a
            href={href}
            className={cn(
                'inline-flex h-[63px] items-center justify-center rounded-full bg-[#8269CF] px-[32px] font-body text-[17px] font-semibold leading-[1.4] tracking-[0] text-content-white transition-(--transition-base) hover:opacity-90 max-sm:h-auto max-sm:min-h-[56px] max-sm:px-6 max-sm:text-[15px]',
                className,
            )}
        >
            {label}
        </a>
    )
}
