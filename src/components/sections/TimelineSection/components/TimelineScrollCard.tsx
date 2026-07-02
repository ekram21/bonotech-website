import type { TimelineSectionItem } from '../TimelineSection.types'

export function TimelineScrollCard({ item }: { item: TimelineSectionItem }) {
    return (
        <article className="mx-auto flex w-full max-w-[576px] flex-col gap-2 rounded-2xl bg-[#EFECF9] p-2">
            <div className="overflow-hidden rounded-xl">
                <img
                    src={item.image}
                    alt=""
                    className="block h-auto w-full"
                    loading="lazy"
                    draggable={false}
                />
            </div>

            <div className="rounded-xl bg-white px-6 py-6 sm:px-8 sm:py-7">
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
