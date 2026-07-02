import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function SwiftIcon(props: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M13.5 2L7 13h5v9l6.5-11.5H13.5V2z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function ProductFocusedIcon(props: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    )
}

export function ExpertLedIcon(props: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <circle cx="12" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M7 20l2.2-4.4a3 3 0 012.7-1.6h2.2a3 3 0 012.7 1.6L19 20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M9.5 7.5l1.2 1.2 3.3-3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export function EvolvedIcon(props: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <rect x="5" y="5" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9 9h2v2H9V9zm4 0h2v2h-2V9zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" fill="currentColor" />
        </svg>
    )
}

export function DeployableIcon(props: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M4 12l8-7 8 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 5v14M8.5 16.5L12 20l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
