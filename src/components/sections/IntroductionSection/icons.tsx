import { cn } from '@/lib/utils'
import speedIconPoster from '@/assets/introduction/speed-icon.png'
import speedIconVideo from '@/assets/introduction/speed-icon.mp4'
import securityIconPoster from '@/assets/introduction/security-icon.png'
import securityIconVideo from '@/assets/introduction/security-icon.mp4'
import outcomeIconPoster from '@/assets/introduction/outcome-icon.png'
import outcomeIconVideo from '@/assets/introduction/outcome-icon.mp4'

export function SpeedIcon({ className }: { className?: string }) {
    return (
        <video
            className={cn('h-12 w-12 rounded-[4px] object-contain', className)}
            width={256}
            height={256}
            preload="none"
            style={{
                background: `transparent url(${speedIconPoster}) 50% 50% / contain no-repeat`,
            }}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
        >
            <source src={speedIconVideo} type="video/mp4" />
        </video>
    )
}

export function SecurityIcon({ className }: { className?: string }) {
    return (
        <video
            className={cn('h-12 w-12 object-contain', className)}
            width={256}
            height={256}
            preload="none"
            style={{
                background: `transparent url(${securityIconPoster}) 50% 50% / contain no-repeat`,
            }}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
        >
            <source src={securityIconVideo} type="video/mp4" />
        </video>
    )
}

export function OutcomeIcon({ className }: { className?: string }) {
    return (
        <video
            className={cn('h-12 w-12 rounded-[12px] object-contain', className)}
            width={256}
            height={256}
            preload="none"
            style={{
                background: `transparent url(${outcomeIconPoster}) 50% 50% / contain no-repeat`,
            }}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
        >
            <source src={outcomeIconVideo} type="video/mp4" />
        </video>
    )
}
