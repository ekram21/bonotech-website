import type { TimelineSectionItem } from '../TimelineSection.types'

interface TimelineScrollCardProps {
    item: TimelineSectionItem
    onImageLoad?: () => void
}

export function TimelineScrollCard({ item, onImageLoad }: TimelineScrollCardProps) {
    return (
        <article className="mx-auto flex w-full max-w-[576px] flex-col gap-2 rounded-2xl bg-[#EFECF9] p-2">
            <div className="overflow-hidden rounded-xl">
                <img
                    src={item.image}
                    alt=""
                    className="block h-auto w-full"
                    loading="lazy"
                    draggable={false}
                    onLoad={onImageLoad}
                />
            </div>

            <div className="rounded-xl bg-white px-6 py-6 sm:px-8 sm:py-7">
                <h3 className="normal-case font-display text-[24px] font-bold leading-none text-content-secondary">
                    {item.title}
                </h3>
                <p className="mt-3 font-body text-[16px] font-normal leading-[1.5] tracking-[-0.25px] text-content-secondary">
                    {item.subtitle}
                </p>
            </div>
        </article>
    )
}
