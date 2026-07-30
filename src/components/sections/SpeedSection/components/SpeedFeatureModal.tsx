import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { SpeedFeatureIcon } from '../SpeedSection.types'

export interface SpeedFeatureModalProps {
    open: boolean
    onClose: () => void
    icon: SpeedFeatureIcon
    title: string
    description: string
    imageSrc: string
    imageAlt?: string
}

export function SpeedFeatureModal({
    open,
    onClose,
    icon: Icon,
    title,
    description,
    imageSrc,
    imageAlt = '',
}: SpeedFeatureModalProps) {
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, onClose])

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
                    role="presentation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.button
                        type="button"
                        aria-label="Close dialog"
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="speed-feature-modal-title"
                        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[28px] border border-[#8269CF]/30 bg-gradient-to-b from-[#1E1238] via-[#140D24] to-[#0A0614] p-6 shadow-2xl sm:p-8"
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-5 sm:top-5"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-5 text-white sm:mb-6">
                            <Icon className="mb-4 h-7 w-7 sm:h-8 sm:w-8" />

                            <h3
                                id="speed-feature-modal-title"
                                className="pr-10 font-display text-[20px] font-bold leading-none tracking-[0] text-white"
                            >
                                {title}
                            </h3>

                            <p className="mt-3 font-body text-[16px] font-normal leading-[150%] tracking-[-0.25px] text-white">
                                {description}
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[20px] sm:rounded-[24px]">
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="aspect-[16/10] w-full object-cover"
                                draggable={false}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    )
}
