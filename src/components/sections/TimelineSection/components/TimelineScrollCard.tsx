import type { TimelineSectionItem } from '../TimelineSection.types'

export function TimelineScrollCard({ item }: { item: TimelineSectionItem }) {
    return (
        <article className="w-full overflow-hidden rounded-[24px] border border-[#E8E9EB] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <div className="flex min-h-[280px] items-center justify-center bg-[#F5F3FB] px-6 py-8 sm:min-h-[320px]">
                <img
                    src={item.image}
                    alt=""
                    className="max-h-[260px] w-full max-w-full object-contain sm:max-h-[300px]"
                    loading="lazy"
                    draggable={false}
                />
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-7">
                <h3 className="font-display text-[20px] font-semibold leading-[1.3] text-[#272829] sm:text-[22px]">
                    {item.title}
                </h3>
                <p className="mt-3 font-body text-[15px] leading-[1.6] text-[#75777A] sm:text-[16px]">
                    {item.subtitle}
                </p>
            </div>
        </article>
    )
}
