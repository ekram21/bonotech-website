import { useLayoutEffect, type RefObject } from "react";

const DESKTOP_QUERY = "(min-width: 741px)";

function layoutTop(element: HTMLElement): number {
    let top = 0;
    let current: HTMLElement | null = element;
    while (current) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
    }
    return top;
}

/**
 * Desktop only: pin the hero glow so rubber-band overscroll does not translate it,
 * while real scrolling still carries it with the hero. Mobile keeps the glow in
 * normal document flow.
 */
export function useHeroAtmospherePin(
    heroRef: RefObject<HTMLElement | null>,
    atmosphereRef: RefObject<HTMLElement | null>,
) {
    useLayoutEffect(() => {
        const hero = heroRef.current;
        const atmosphere = atmosphereRef.current;
        if (!hero || !atmosphere) return;

        const desktop = window.matchMedia(DESKTOP_QUERY);
        let documentTop = 0;

        const clearPin = () => {
            atmosphere.classList.remove("is-pinned");
            atmosphere.style.height = "";
            atmosphere.style.transform = "";
        };

        const place = () => {
            atmosphere.style.transform = `translate3d(0, ${documentTop - window.scrollY}px, 0)`;
        };

        const sync = () => {
            if (!desktop.matches) {
                clearPin();
                return;
            }

            atmosphere.classList.add("is-pinned");
            documentTop = layoutTop(hero);
            atmosphere.style.height = `${hero.offsetHeight}px`;
            place();
        };

        const onScroll = () => {
            if (!desktop.matches) return;
            place();
        };

        sync();

        const observer = new ResizeObserver(sync);
        observer.observe(hero);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", sync);
        desktop.addEventListener("change", sync);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", sync);
            desktop.removeEventListener("change", sync);
            clearPin();
        };
    }, [heroRef, atmosphereRef]);
}
