import type { ComponentType, SVGProps } from 'react'

export interface SpeedSectionProps {
    className?: string
}

export type SpeedFeatureIcon = ComponentType<SVGProps<SVGSVGElement>>

export interface SpeedFeatureModalContent {
    title: string
    description: string
    imageSrc: string
    imageAlt?: string
}

export interface SpeedFeatureItem {
    id: string
    title: string
    tag: string
    icon: SpeedFeatureIcon
    modal?: SpeedFeatureModalContent
}
