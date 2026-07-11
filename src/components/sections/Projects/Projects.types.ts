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
    mockupScale?: number
    mockupBlendMode?: React.CSSProperties['mixBlendMode']
    iconSrc?: string
    iconWidth?: number
    iconHeight?: number
    iconCover?: boolean
    logoSrc: string
    logoAlt: string
    logoMarkSrc?: string
    logoMarkHeight?: number
    logoWordmarkHeight?: number
    logoWordmarkOffsetY?: number
    logoDark?: boolean
    logoWidth?: number
    logoHeight?: number
    logoBlendMode?: React.CSSProperties['mixBlendMode']
    playStoreHref?: string
    appStoreHref?: string
    learnMoreHref?: string
    opacity?: number
}

export interface ProjectCardProps {
    project: ProjectCardData
}
