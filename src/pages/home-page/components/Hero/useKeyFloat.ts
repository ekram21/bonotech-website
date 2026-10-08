import { useEffect, type RefObject } from "react";

/** Gentle hover/focus float for the key artwork inside a `.home-key`. */
export function useKeyFloat(keyImageRef: RefObject<HTMLImageElement | null>) {
    useEffect(() => {
        const keyImage = keyImageRef.current;
        if (!keyImage) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let keyFloat: Animation | null = null;

        const startKeyFloat = () => {
            if (
                reducedMotion.matches ||
                !keyImage.animate ||
                keyFloat?.effect?.getTiming().iterations === Infinity
            ) {
                return;
            }

            const restingPose = getComputedStyle(keyImage).transform;
            keyFloat?.cancel();
            keyFloat = keyImage.animate(
                [
                    { transform: restingPose, easing: "ease-in-out" },
                    {
                        transform: "translate3d(0,-7px,0) rotateX(1deg) rotateY(-1deg)",
                        easing: "ease-in-out",
                    },
                    { transform: restingPose },
                ],
                { duration: 4600, iterations: Infinity },
            );
        };

        const stopKeyFloat = (immediate = false) => {
            const current = keyFloat;
            if (!current) return;

            const currentPose = getComputedStyle(keyImage).transform;
            current.cancel();
            keyFloat = null;

            if (immediate) return;

            const settle = keyImage.animate(
                [{ transform: currentPose }, { transform: "none" }],
                { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" },
            );
            keyFloat = settle;
            settle.onfinish = () => {
                if (keyFloat === settle) keyFloat = null;
            };
        };

        const key = keyImage.closest(".home-key");
        if (!key) return;

        const onEnter = (event: Event) => {
            const pointerType = (event as PointerEvent).pointerType;
            if (pointerType === "mouse" || pointerType === "pen") startKeyFloat();
        };
        const onLeave = () => {
            if (!key.matches(":focus-visible")) stopKeyFloat();
        };
        const onFocus = () => {
            if (key.matches(":focus-visible")) startKeyFloat();
        };
        const onBlur = () => {
            if (!key.matches(":hover")) stopKeyFloat();
        };
        const onReduced = (event: MediaQueryListEvent) => {
            if (event.matches) stopKeyFloat(true);
        };

        key.addEventListener("pointerenter", onEnter);
        key.addEventListener("pointerleave", onLeave);
        key.addEventListener("focus", onFocus);
        key.addEventListener("blur", onBlur);
        reducedMotion.addEventListener("change", onReduced);

        return () => {
            key.removeEventListener("pointerenter", onEnter);
            key.removeEventListener("pointerleave", onLeave);
            key.removeEventListener("focus", onFocus);
            key.removeEventListener("blur", onBlur);
            reducedMotion.removeEventListener("change", onReduced);
            stopKeyFloat(true);
        };
    }, [keyImageRef]);
}
