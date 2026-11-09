import { useEffect } from 'react'

/** Sets page and social metadata, restoring previous values on unmount. */
export function usePageMeta(title: string, description: string, image?: string) {
    useEffect(() => {
        const previousTitle = document.title
        const shareImage = image ? new URL(image, window.location.origin).href : undefined
        const updates: Array<[string, string | undefined]> = [
            ['meta[name="description"]', description],
            ['meta[property="og:title"]', title],
            ['meta[property="og:description"]', description],
            ['meta[property="og:image"]', shareImage],
            ['meta[property="og:image:alt"]', shareImage ? `${title} — selected Bonotech work` : undefined],
            ['meta[name="twitter:title"]', title],
            ['meta[name="twitter:description"]', description],
            ['meta[name="twitter:image"]', shareImage],
        ]
        const previousValues = updates.map(([selector]) => {
            const element = document.querySelector<HTMLMetaElement>(selector)
            return { element, content: element?.content }
        })

        document.title = title
        updates.forEach(([_, content], index) => {
            if (content !== undefined && previousValues[index].element) {
                previousValues[index].element!.content = content
            }
        })

        return () => {
            document.title = previousTitle
            previousValues.forEach(({ element, content }) => {
                if (element && content !== undefined) element.content = content
            })
        }
    }, [title, description, image])
}
