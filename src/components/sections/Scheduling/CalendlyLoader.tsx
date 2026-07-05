export function CalendlyLoader() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[#fafafa]">
            <div className="flex flex-col items-center gap-4">
                <div className="calendly-loader" aria-hidden="true" />

                <p className="text-sm font-medium text-gray-600">Loading scheduler...</p>
            </div>
        </div>
    )
}
