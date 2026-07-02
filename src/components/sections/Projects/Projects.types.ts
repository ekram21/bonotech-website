export interface ProjectsProps {
    className?: string
}

export interface ProjectCardData {
    id: string
    category: string
    title: string
    features: string[]
    backgroundColor: string
    borderColor: string
    buttonColor: string
    bulletColor?: string
    mockupSrc: string
    iconSrc?: string
    iconWidth?: number
    iconHeight?: number
    iconCover?: boolean
    logoSrc: string
    logoAlt: string
    logoDark?: boolean
    logoWidth?: number
    logoHeight?: number
    playStoreHref?: string
    appStoreHref?: string
    learnMoreHref?: string
    opacity?: number
}

export interface ProjectCardProps {
    project: ProjectCardData
}
