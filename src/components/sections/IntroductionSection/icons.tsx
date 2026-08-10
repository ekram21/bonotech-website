import { cn } from '@/lib/utils'
import speedIconGif from '@/assets/SPEED.gif'
import securityIconGif from '@/assets/Security.gif'
import outcomeIconGif from '@/assets/Outcome_2.gif'

const iconImgStyle = { imageRendering: 'auto' } as const

export function SpeedIcon({ className }: { className?: string }) {
    return (
        <img
            src={speedIconGif}
            alt=""
            width={128}
            height={128}
            className={cn('h-14 w-14 object-contain', className)}
            style={iconImgStyle}
            aria-hidden="true"
            draggable={false}
        />
    )
}

export function SecurityIcon({ className }: { className?: string }) {
    return (
        <img
            src={securityIconGif}
            alt=""
            width={128}
            height={128}
            className={cn('h-14 w-14 object-contain', className)}
            style={iconImgStyle}
            aria-hidden="true"
            draggable={false}
        />
    )
}

export function OutcomeIcon({ className }: { className?: string }) {
    return (
        <img
            src={outcomeIconGif}
            alt=""
            width={128}
            height={128}
            className={cn('h-14 w-14 object-contain', className)}
            style={iconImgStyle}
            aria-hidden="true"
            draggable={false}
        />
    )
}
