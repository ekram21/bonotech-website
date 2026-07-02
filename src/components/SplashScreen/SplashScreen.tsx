import { useEffect, useLayoutEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import bonotechSplashMark from '@/assets/bonotech-splash-mark.png'
import bonotechSplashWordmark from '@/assets/bonotech-splash-wordmark.png'
import type { SplashScreenProps } from './SplashScreen.types'

type SplashPhase = 'logo-rise' | 'text-in' | 'hold' | 'exit'

const LOGO_RISE_MS = 900
const TEXT_IN_MS = 950
const HOLD_MS = 600
const EXIT_MS = 500
const WORDMARK_GAP = 14

const slideEase = [0.22, 1, 0.36, 1] as const

function getSlideStartX() {
    return window.innerWidth < 640 ? 150 : 200
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [phase, setPhase] = useState<SplashPhase>('logo-rise')
    const groupControls = useAnimation()
    const showText = phase !== 'logo-rise'

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) {
            onComplete()
            return
        }

        const textTimer = window.setTimeout(() => setPhase('text-in'), LOGO_RISE_MS)
        const holdTimer = window.setTimeout(
            () => setPhase('hold'),
            LOGO_RISE_MS + TEXT_IN_MS,
        )
        const exitTimer = window.setTimeout(
            () => setPhase('exit'),
            LOGO_RISE_MS + TEXT_IN_MS + HOLD_MS,
        )
        const completeTimer = window.setTimeout(
            onComplete,
            LOGO_RISE_MS + TEXT_IN_MS + HOLD_MS + EXIT_MS,
        )

        return () => {
            window.clearTimeout(textTimer)
            window.clearTimeout(holdTimer)
            window.clearTimeout(exitTimer)
            window.clearTimeout(completeTimer)
        }
    }, [onComplete])

    // Step 2: wordmark at full size — whole group slides right → center together
    useLayoutEffect(() => {
        if (!showText) {
            void groupControls.set({ x: 0 })
            return
        }

        const startX = getSlideStartX()
        void groupControls.set({ x: startX })
        void groupControls.start({
            x: 0,
            transition: { duration: TEXT_IN_MS / 1000, ease: slideEase },
        })
    }, [showText, groupControls])

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white overflow-hidden"
            initial={{ y: 0 }}
            animate={{ y: phase === 'exit' ? '-100%' : 0 }}
            transition={{ duration: EXIT_MS / 1000, ease: slideEase }}
            aria-hidden="true"
        >
            <motion.div
                className="flex items-center"
                animate={groupControls}
                initial={{ x: 0 }}
            >
                {/* Step 1: icon rises bottom → middle (solo, centered via parent flex) */}
                <motion.img
                    src={bonotechSplashMark}
                    alt=""
                    className="h-[52px] w-auto sm:h-[64px] object-contain shrink-0"
                    draggable={false}
                    initial={{ y: '42vh', scale: 0.55, opacity: 0.6 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{
                        duration: LOGO_RISE_MS / 1000,
                        ease: slideEase,
                    }}
                />

                {/* Step 2: full-size text — moves with the group, no separate scale/slide */}
                {showText && (
                    <img
                        src={bonotechSplashWordmark}
                        alt=""
                        className="h-[36px] w-auto sm:h-[44px] object-contain shrink-0"
                        style={{ marginLeft: WORDMARK_GAP }}
                        draggable={false}
                    />
                )}
            </motion.div>
        </motion.div>
    )
}
