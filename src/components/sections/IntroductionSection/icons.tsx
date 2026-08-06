import { cn } from '@/lib/utils'
import speedIconGif from '@/assets/SPEED.gif'
import securityIconGif from '@/assets/Security.gif'
import outcomeIconGif from '@/assets/Outcome_2.gif'

export function SpeedIcon({ className }: { className?: string }) {
    return (
        <img
            src={speedIconGif}
            alt=""
            width={256}
            height={256}
            className={cn('h-12 w-12 rounded-[4px] object-contain', className)}
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
            width={256}
            height={256}
            className={cn('h-12 w-12 object-contain', className)}
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
            width={256}
            height={256}
            className={cn('h-12 w-12 rounded-[12px] object-contain', className)}
            aria-hidden="true"
            draggable={false}
        />
    )
}
