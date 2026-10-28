// src/lib/constants/tokens.ts
// Mirror of CSS vars for use in framer-motion or inline logic only.
// Never use these to set styles directly in JSX — use Tailwind classes.

export const TOKENS = {
    transitions: {
        fast: 'all 015s ease',
        base: 'all 025s ease',
        slow: 'all 04s ease',
    },
} as const
