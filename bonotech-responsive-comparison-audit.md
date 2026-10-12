# Bonotech responsive comparison audit

Reviewed 12 October 2026. Updated with an exact Chrome viewport pass.

## Scope and test method

- Our build: `colon-insertion-among-arrivals.trycloudflare.com`
- Client reference: `exit-email-farmer-accidents.trycloudflare.com/index.html`
- Production: `bonotech.io`
- Pages tested: home on all three sites; portfolio on our and reference builds.
- Exact viewport matrix: 2560, 1440, 1024, 768, 425, 375 and 320 px wide, each at 825 px high (the 2560 px run used 1440 px height for the representative hero capture).
- At every width I checked page-level horizontal overflow, clipping of visible text controls, header breakpoint behavior, hero layout, and the page after it had fully rendered. I also visually compared representative 4K and 320 px captures.

## Overall result

After content finishes loading, the home and portfolio pages have no document-level horizontal overflow at any requested width. I found no visible clipped or conjoined text in the checked states. The header switches from desktop navigation to the hamburger at the same 768 px breakpoint in our build and the reference.

The two actionable responsive/parity findings are below.

## Confirmed issues in our build

### R1 — Home hero sits too high compared with the client reference

**Priority:** P2 — visual parity  
**Where:** Home hero, every requested viewport.

The header dimensions and headline width match, but our hero's main headline is positioned above the reference. This makes the hero feel less vertically balanced and leaves more unused space at the bottom.

| Width | Our headline top | Reference headline top | Difference |
| --- | ---: | ---: | ---: |
| 2560 | 468 px | 510 px | 42 px too high |
| 1440 | 450 px | 471 px | 21 px too high |
| 1024 | 458 px | 482 px | 24 px too high |
| 768 | 475 px | 499 px | 24 px too high |
| 425 | 344 px | 371 px | 27 px too high |
| 375 | 340 px | 367 px | 27 px too high |
| 320 | 346 px | 373 px | 27 px too high |

At 2560 px, our hero is also 42 px shorter than the reference (1011 px vs 1053 px). Align the hero's vertical content distribution/min-height with the reference rather than adding a width-specific offset.

### R2 — Portfolio opens as a nearly blank page before the content hydrates

**Priority:** P1 — first impression/loading defect  
**Where:** Our `/portfolio` route, confirmed at 1440 px; likely viewport-independent.

Immediately after navigation, the page shows only an incomplete header on a blank dark canvas: no logo, hero, or portfolio content. It was still blank at 250 ms and became populated before the one-second mark. The reference `/portfolio.html` exposes its full page structure immediately in the same test.

Use a server-rendered/static initial state, a visible skeleton, or keep the hero/logo in the initial bundle. Avoid an empty first paint while route code, assets, or client-side data initialize.

## Responsive checks that passed

- **Page fit:** zero document-level horizontal overflow at 2560, 1440, 1024, 768, 425, 375 and 320 px on the tested, fully rendered pages.
- **Typography:** no visible word joining, cut-off heading, truncated button label, or overflowing form/footer text in the checked viewports.
- **Header:** desktop navigation at 1024 px and above; labeled hamburger navigation at 768 px and below, matching the reference breakpoint.
- **Mobile hero:** both builds correctly move from desktop's side-by-side supporting copy to the stacked 425/375/320 px order. The 320 px header is tight but it remains functional and un-clipped.
- **Portfolio after hydration:** the 23-section portfolio has no page-level overflow from 320 through 2560 px. The reference's off-canvas delivery-card slides are clipped within their carousel rather than producing a page scroll, so they are not counted as overflow defects.

## Reference-build differences to confirm

These are implementation/content differences rather than automatically defects. They should be resolved only after confirming the intended source of truth.

- **Client-logo interaction:** the reference presents the selected client logos as images; ours makes them outbound links.
- **Featured assets/testimonials:** the reference's commitment module starts with Stefano Murdaca / DIVC, while ours starts with Evan Milho / EVO Grading. The default testimonial ordering also differs.
- **Booking/newsletter state:** the reference says that live booking is not connected and disables newsletter subscription as “coming soon”; ours exposes selectable times and an active Subscribe control. Retain ours only if those integrations are genuinely live.
- **Portfolio mobile vertical rhythm:** at 320 px ours starts the portfolio heading 8 px lower than the reference and is 27–40 px lower from the final case study through the footer. There is no clipping; this is likely explained by an intentional asset/copy change, but it prevents strict pixel parity.
- **Small copy/punctuation drift:** apostrophe style, em-dash spacing, CTA semantics (“Get In Touch” link versus button), and testimonial punctuation differ.

## Production drift — separate from reference parity

Production is responsive at all seven tested widths and has no page-level overflow, but it is a different content/navigation release:

- It omits **Portfolio** from the header and footer, while both review builds link to a substantial portfolio page.
- Its home hero vertical placement matches our build (within 0–2 px), not the client reference. Consequently, R1 is also visible in production.
- It uses different copy, including “23+ projects, and that’s just in the last 6 months,” “aging” rather than “ageing,” and “teams and management” rather than “teams/management.”
- It starts testimonials with Nafis Abrar / Polysignals rather than our Evan Milho / EVO state.

Treat production as a separate/older release; do not use it as the sole design authority for the current client reference.

## Copy and content issues

- **Service Scopes:** “to work in dated phases” is not idiomatic. Prefer “working in defined phases with weekly shippable increments.”
- **Service Scopes:** “in just 30 days or less” is redundant. Use either “in 30 days or less” or “in just 30 days.”
- **Portfolio:** “a platform that answers your business needs” is less natural than “a platform that meets your business needs” (or, if the intent is Q&A, “answers your business questions”).
- **Performance claims:** “400% Faster Development” and “200% Faster QA Cycles” need a stated baseline/methodology; without it, the percentage wording is ambiguous.

## Notes

Animated/off-canvas carousel items were excluded from defect counts where their containing carousel clipped them correctly and the document width remained equal to the viewport. No form was submitted and no external data was changed during the audit.
