export function CalendlyLoader() {
    return (
        <div className="flex h-full min-h-[620px] w-full items-center justify-center bg-[#fafafa]">
            <div className="flex flex-col items-center gap-4">
                <div className="calendly-loader" aria-hidden="true" />

                <p className="font-body text-sm font-medium text-[#444547]">
                    Loading scheduler...
                </p>
            </div>
        </div>
    )
}
