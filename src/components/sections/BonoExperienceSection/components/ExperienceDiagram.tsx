import bonotechMark from '@/assets/bonotech-splash-mark.png'

interface ExperienceDiagramProps {
    labels: [string, string, string, string]
    variant?: 'default' | 'highlighted'
}

function DiagramBox({
    label,
    variant,
}: {
    label: string
    variant: 'default' | 'highlighted'
}) {
    const isHighlighted = variant === 'highlighted'

    return (
        <div
            className={[
                'flex w-full items-center justify-center rounded-xl border border-dashed p-4 text-center font-body text-[12px] font-semibold leading-none tracking-[-0.015em]',
                isHighlighted
                    ? 'border-[#A28FDB] bg-[#A28FDB]/10 text-white'
                    : 'border-[#CFC5EC] bg-[#F4F5F6] text-[#313233]',
            ].join(' ')}
        >
            {label}
        </div>
    )
}

function CenterLogo({ variant }: { variant: 'default' | 'highlighted' }) {
    const isHighlighted = variant === 'highlighted'

    return (
        <div
            className={[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12',
                isHighlighted
                    ? 'bg-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.12)]'
                    : 'bg-white shadow-[0_4px_20px_rgba(130,105,207,0.14)]',
            ].join(' ')}
        >
            <img
                src={bonotechMark}
                alt=""
                aria-hidden="true"
                className={`h-6 w-6 object-contain sm:h-7 sm:w-7 ${isHighlighted ? 'brightness-0 invert' : ''}`}
            />
        </div>
    )
}

export function ExperienceDiagram({ labels, variant = 'default' }: ExperienceDiagramProps) {
    const isHighlighted = variant === 'highlighted'
    const lineColor = isHighlighted ? '#A28FDB' : '#CFC5EC'

    return (
        <div className="relative mt-8 w-full">
            <div className="relative mx-auto w-full">
                <svg
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                    viewBox="0 0 360 200"
                    fill="none"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                >
                    <line x1="88" y1="44" x2="180" y2="100" stroke={lineColor} strokeWidth="1" strokeDasharray="3 4" />
                    <line x1="272" y1="44" x2="180" y2="100" stroke={lineColor} strokeWidth="1" strokeDasharray="3 4" />
                    <line x1="88" y1="156" x2="180" y2="100" stroke={lineColor} strokeWidth="1" strokeDasharray="3 4" />
                    <line x1="272" y1="156" x2="180" y2="100" stroke={lineColor} strokeWidth="1" strokeDasharray="3 4" />
                </svg>

                <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_auto] items-center gap-2">
                    <div className="col-start-1 row-start-1">
                        <DiagramBox label={labels[0]} variant={variant} />
                    </div>

                    <div className="col-start-3 row-start-1">
                        <DiagramBox label={labels[1]} variant={variant} />
                    </div>

                    <div className="col-start-2 row-start-2 flex items-center justify-center py-1">
                        <CenterLogo variant={variant} />
                    </div>

                    <div className="col-start-1 row-start-3">
                        <DiagramBox label={labels[2]} variant={variant} />
                    </div>

                    <div className="col-start-3 row-start-3">
                        <DiagramBox label={labels[3]} variant={variant} />
                    </div>
                </div>
            </div>
        </div>
    )
}
