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
    categoryTextColor?: string
    bulletColor?: string
    mockupSrc: string
    mockupScale?: number
    mockupWidth?: number
    mockupBlendMode?: React.CSSProperties['mixBlendMode']
    iconSrc?: string
    iconWidth?: number
    iconHeight?: number
    iconCover?: boolean
    logoSrc: string
    logoAlt: string
    logoDark?: boolean
    logoWidth?: number
    logoHeight?: number
    logoBlendMode?: React.CSSProperties['mixBlendMode']
    playStoreHref?: string
    appStoreHref?: string
    learnMoreHref?: string
    opacity?: number
    builtInDays?: string
    builtInDaysColor?: string
    buildColor?: string
    radiusColor?: string
}

export interface ProjectCardProps {
    project: ProjectCardData
}
