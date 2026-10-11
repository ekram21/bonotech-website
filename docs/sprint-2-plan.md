# Sprint 2 – Implementation Plan

**Repo:** `bonotech-website` (React 19 + Vite + Tailwind, Firebase Hosting)
**Branch:** `feat/update-ui-2`
**Design source:** `/Users/imran/Desktop/Edutechs/Bonotech-Website-Handover/dist` (static HTML/CSS/JS – treat as the visual and behavioural spec)
**Goal:** every ported section is **pixel-perfect** against the handover (see §5).
**Status:** All tasks (1–7, P, 6a–6d) committed. Not deployed.

---

## 1. Requirements

1. Home page: disclaimer under "Numbers That Define Our Sprints" saying figures may vary from project to project.
2. Home page: Zatiq logo in "BRANDS WE'VE BUILT WITH".
3. Home page: hyperlinks for the "BUILT FOR YOUR BUSINESS" section's bottom lines.
4. Home page: move "AVERAGE DELIVERY TIMES" before "OUR SERVICE SCOPE".
5. Redesigned nav bar.
6. Portfolio page with simulations.
7. Dedicated schedule link for cold emails, e.g. *"Do you have 15 minutes this Wednesday? If not, you can pick a time at bonotech.io/discovery-meeting"*.
8. **All of the above must be pixel-perfect against the handover design.**

## 2. Progress

| Task | Description                         | Commit    | Pixel-verified |
| ---- | ----------------------------------- | --------- | -------------- |
| 1    | Sprint metrics disclaimer           | `edfac0f` | Yes – `a8fc514` |
| 2    | Zatiq in brands section             | `bf52ef3` | Yes – `a8fc514` |
| 3    | Delivery times above service scopes | `49d8522` | Yes – `a8fc514` |
| 4    | Built For Your Business + CTA links | `be23e68` | Yes – `a8fc514` |
| 5    | Navbar redesign                     | `50e7b33` | Yes – `389481e` (1362px + 390px) |
| P    | Pixel audit of Tasks 1–4            | `a8fc514` | Yes (1440, 1024, 768, 390px) |
| 6a   | Portfolio shell, hero, project stack, index | `dbdff1f` | Yes (1440, 1024, 768, 390px) |
| 6b   | Enterprise + Gustav simulations | `a4b0be4` | Yes (1440, 1024, 768, 390px; every chapter) |
| 6c   | DITECH, Olmo, Get My Grail simulations | `6d235da` | Yes (1440, 1024, 768, 390px; every chapter) |
| 6d   | Discovery section, footer, deep links | `4a22bf9` | Yes (footer at 1440 and 873px; deep links at 873px) |
| 7    | `/discovery-meeting` page           | `14e2275` | Yes (section and navbar identical to the home page at 873px) |

## 3. Gap analysis (React app vs. handover)

| #   | Item                            | Original React state                                                                            | Handover reference                                                                                                                              |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Metrics disclaimer              | Uncommitted change with different wording                                                       | `index.html` `.metrics-disclaimer`, `metrics.css`                                                                                               |
| 2   | Zatiq logo                      | `src/assets/clients/zatiq.svg` exists but not in the orbit                                      | `index.html` `#our-clients`, `clients.css` (`.logo-zatiq`), `clients.js`                                                                        |
| 3   | "Built For Your Business" links | Entire Service Tiers / Solutions section missing                                                | `index.html` `#service-tiers`, `service-tiers.css`, `service-tiers.js`, `assets/service-tiers/*`                                                |
| 4   | Section order                   | Scopes → Delivery                                                                               | Delivery → Scopes → Solutions                                                                                                                   |
| 5   | Navbar                          | Old full-width bar                                                                              | `navigation.css`, `navigation.js` (floating glass pill)                                                                                         |
| 6   | Portfolio page                  | No `/portfolio` route                                                                           | `portfolio.html` + `portfolio*.css/js`, `project-stack.*`, `enterprise-demo.*`, `gustav-demo.*`, `ditech-demo.*`, `olmo-demo.*`, `grail-demo.*` |
| 7   | Schedule link                   | Discovery form on home page, sends real email via `src/lib/services/email.ts`                   | `#discovery-call` section (handover version is preview-only)                                                                                    |

## 4. Decisions (confirmed)

- Disclaimer copy: **"These figures may vary from project to project."** (handover wording)
- Schedule URL: `/discovery-meeting`
- Commits on: `feat/update-ui-2`
- No deployment unless explicitly requested.

---

## 5. Pixel-perfect standard (applies to every task)

### 5.1 What must match

For every visible element in the ported section, compared at the same viewport and scroll state:

- **Box geometry:** x, y, width, height (`getBoundingClientRect`).
- **Typography:** `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`, text wrapping (same line breaks).
- **Colour:** `color`, `background` (including gradients), `border-color`, `opacity`, `filter`.
- **Spacing:** `padding`, `margin`, `gap`.
- **Shape and depth:** `border-width`, `border-radius`, `box-shadow`, `backdrop-filter`.
- **Images and icons:** the same asset file (not a lookalike), rendered at the same size and position.
- **Motion:** same durations, easing, delays and auto-rotation intervals; same reduced-motion behaviour.
- **States:** hover, focus-visible (outline colour and offset), active/`aria-current`, open/closed menus, paused controls.

### 5.2 Tolerance

- **0px** difference in computed styles.
- **≤ 0.5px** difference in box geometry (sub-pixel rounding only).
- Any larger difference is either fixed or listed as a known exception in §5.5 with a reason.

### 5.3 Breakpoints to check

| Viewport | Why                                          |
| -------- | -------------------------------------------- |
| 1440px   | Main desktop design width                    |
| 1362px   | Reference width used for navbar measurements |
| 1024px   | Small laptop / tablet landscape              |
| 941px    | Last width before the compact navbar         |
| 940px    | Compact navbar breakpoint                    |
| 768px    | Tablet portrait                              |
| 390px    | Main mobile width                            |
| 360px    | Smallest supported mobile                    |

Plus every `@media` breakpoint that the section's handover CSS defines.

### 5.4 Method

1. **Port faithfully.** Keep the handover class names and copy its CSS verbatim into the component's `.css` file. Use the handover's exact asset files (copy them into `src/assets/...`, under a new name if a file with that name already exists).
2. **Neutralise app-level leaks.** These differences come from Tailwind preflight or `globals.css`, not from the handover. Check them first:
   - `line-height` inherited from `body` (handover uses `normal`).
   - `font-family` not inherited by buttons and inputs.
   - Default button padding removed by preflight (`1px 6px` in the handover).
   - `img`/`svg` set to `display:block` and `max-width:100%`.
   - `border-style: solid` and `border-color` defaults on `*`.
   - Heading and paragraph margins reset to 0.
3. **Measure in both builds.** Run the same CDP `Runtime.evaluate` script on the React page (`http://localhost:5173/...`) and the handover (`http://127.0.0.1:4317/...`) at each breakpoint, and diff the output:

   ```js
   (() => {
     const r = (e) => {
       const b = e.getBoundingClientRect(), s = getComputedStyle(e);
       return [e.className || e.tagName, b.x, b.y, b.width, b.height,
         s.fontFamily, s.fontSize, s.fontWeight, s.lineHeight, s.letterSpacing,
         s.color, s.backgroundColor, s.padding, s.margin, s.borderRadius,
         s.boxShadow].join(' | ');
     };
     return SELECTORS.flatMap((q) => [...document.querySelectorAll(q)].map(r));
   })()
   ```

   Use `Emulation.setDeviceMetricsOverride` for mobile widths and clear it afterwards. Measure only after the splash screen has finished.
4. **Compare visually.** Take screenshots of both builds at 1440px and 390px for the same section and scroll position. Take a second screenshot if the first is stale.
5. **Check states and motion.** Hover, keyboard focus, open/close, auto-rotation timing, pause, and `prefers-reduced-motion`.
6. **Record the result** in §2 (Pixel-verified column) and list any exception in §5.5.

### 5.5 Known exceptions

| Area                     | Difference                                                                    | Reason / resolution                                         |
| ------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Navbar toggle (≤940px)   | Button padding `0` vs `1px 6px`                                               | Preflight reset; icon bars render at identical positions     |
| Discovery call section   | React form sends real email; handover is a preview with different slot copy   | Functional difference kept on purpose; visual shell must match |
| Client logos             | Rendered as links (`a.client-face`) instead of `div` | Same box and styles; adds keyboard focus outline only |
| Buttons (preflight)      | Tier arrows/motion button padding `0` vs `1px 6px`; delivery dot `color` `#f9f7ff` vs `#fff` | No visible effect (icons centred, colour unused) |
| Hero canvas (home + portfolio) | `FlowBackground` wraps the `<canvas>` in `div.flow-canvas` | Same box and fade; shared component |
| Portfolio index          | Visible since 6c                                                              | Panel contents match exactly |
| Footer                   | Working newsletter form and note copy, live year, "Back to Top" is a `<button>` | Functional differences; geometry matches the handover |
| About testimonial photo  | Uses lighter `stefano-portrait.jpg` instead of 1.9 MB `stefano-murdaca.png` | Same photo and aspect ratio; same crop via handover CSS |

---

## 6. Tasks (one commit per task)

### Task 1 – Sprint metrics disclaimer ✅ `edfac0f`

- **Prompt:** Disclaimer under "Numbers That Define Our Sprints" using the handover wording and `.metrics-disclaimer` styling from `metrics.css`.
- **Files:** `src/pages/home-page/components/SprintMetricsSection.tsx`, `SprintMetricsSection.css`

### Task 2 – Zatiq in brands section ✅ `bf52ef3`

- **Prompt:** Zatiq as the 8th client in the orbit with `logo-zatiq` sizing from `clients.css`.
- **Files:** `client-showcase-section/ClientShowcaseSection.tsx`, `ClientShowcaseSection.css`

### Task 3 – Reorder home sections ✅ `49d8522`

- **Prompt:** Hero → Metrics → Clients → About → Delivery Times → Service Scopes → Solutions → Technology → Testimonials → Discovery, with matching background transitions.
- **Files:** `HomePage.tsx`, `DeliveryTimesSection.css`, `TechnologyStackSection.css`

### Task 4 – "Built For Your Business" Solutions section + CTA links ✅ `be23e68`

- **Prompt:** Port `#service-tiers` into `ServiceTiersSection`; each `.tier-relationship` line links to `#discovery-call`.
- **Files:** `service-tiers-section/ServiceTiersSection.tsx` + `.css`, `src/assets/service-tiers/*`, `HomePage.tsx`

### Task 5 – Navbar redesign ✅ `50e7b33`, pixel fix `389481e`

- **Prompt:** Floating glass pill navbar from `navigation.css` / `navigation.js`.
- **Pixel result:** header, logo (146×22.91), links (12px, `rgb(230,221,236)`, −0.18px, `0 13px`, 44px tall) and CTA (132.43×46) match at 1362px and 390px.
- **Files:** `src/shared/Navbar.tsx`, `src/shared/navbar.css`, `src/assets/bonotech-logo-nav.svg`, `src/lib/scroll.ts`, `globals.css`, `Hero.css`

### Task P – Pixel audit of Tasks 1–4 ✅ `a8fc514`

- **Result:** every audited section (metrics, clients, about, delivery, scopes, solutions, technology, testimonials) now has identical height and element geometry to the handover at 1440, 1024, 768 and 390px. Fixes: `line-height: normal` on the home page wrapper (Tailwind preflight leaked 1.5), metrics/clients padding and `min-height`, clients CSS restored verbatim with handover recess shading (`--recess-shade` overlay instead of `brightness()`), delivery mobile values, about photo crop, technology core mark (handover asset), curly apostrophes.
- **Copy:** service scope cards switched to the handover wording in `8ca42af` (user decision).
- **Audit tooling:** `.pixel-audit/` (local only, git-excluded).

**Original prompt:**

- **Prompt:** Apply §5 to every section touched in Tasks 1–4 and fix any differences:
  - **Metrics:** `.metrics-disclaimer` (font size at each clamp step, colour `#b8abc8`, 26px top margin, max-width 1540px) plus the metric cards around it.
  - **Clients:** orbit size and position, each logo face (especially `.logo-zatiq` at 86% width), controls, live-region text, rotation timing with 8 logos.
  - **Delivery → Scopes → Solutions → Technology:** section paddings and background gradients at each seam (no visible banding or hard edges).
  - **Solutions:** tabs (size, active state), wheel position and `--tier-turn` rotation, diagram text (17px Montserrat, `#dfcfee`), `.tier-relationship` link styles including hover and focus, 40s auto-rotation, mobile swipe layout.
- **Breakpoints:** all of §5.3.
- **Done when:** every element is within the §5.2 tolerance, or listed in §5.5.
- **Commit:** `fix(home): pixel parity for metrics, clients and solutions sections` (split per section if the diff is large).

### Task 6 – Portfolio page with simulations (4 commits)

General rules:

- Each demo is its own React component. All timers, rAF and IntersectionObservers live in hooks with cleanup. Pause offscreen and respect `prefers-reduced-motion`.
- Use handover `checks/*.test.mjs` as the behavioural and timing reference.
- Copy the required assets (`get-my-grail/`, `olmo-cracked-bathtub.jpg`, `clients/olmo-light.svg`, keys, etc.) as exact files.
- **Pixel rule:** copy each `*-demo.css` verbatim and keep the class names and SVG `viewBox` values unchanged. Measure each demo's frame, labels and controls per §5 at 1440px and 390px before committing. Demo frames must also match at mid-animation checkpoints (same frame at the same elapsed time).

- **6a – Shell, hero, project stack, portfolio index** ✅ `dbdff1f`
  - **Prompt:** Add the `/portfolio` route and `PortfolioPage` with Navbar, hero (reuse `FlowBackground`), `#highlighted-projects` project stack and the floating portfolio index panel. Add the **Portfolio** link to the navbar (between Solutions and Testimonials) and to the footer Explore list (after About Bonotech).
  - **Pixel check:** navbar link x-positions now match the handover exactly (resolves the §5.5 navbar exception). Also hero type scale, project stack card geometry and the index panel's position, width and active-item state.
  - **Commit:** `feat(portfolio): add portfolio page shell, hero and project stack`
- **6b – Enterprise + Gustav simulations** ✅ `a4b0be4`
  - **Prompt:** Port `#enterprise-case` (`enterprise-demo.*`) and `#gustav-case` (`gustav-demo.*`) with playback controls, chapters and replay.
  - **Pixel check:** factory and map SVG labels (font, size, fill), chapter controls and progress bars at the start, middle and end of playback.
  - **Commit:** `feat(portfolio): add enterprise and Gustav simulations`
- **6c – DITECH, Olmo, Get My Grail simulations** ✅ `6d235da`
  - **Prompt:** Port `#ditech-case`, `#olmo-case` and `#grail-case` with their demos and controls.
  - **Pixel check:** device frames, screenshots/images at native aspect ratio, overlay text and control placement.
  - **Commit:** `feat(portfolio): add DITECH, Olmo and Get My Grail simulations`
- **6d – Discovery + footer + deep links** ✅ `4a22bf9`
  - **Result:** every case deep link and `#discovery-call` lands about 98px from the top at 873px (equal to `scroll-padding-top`), the same as the handover. The footer was brought to handover parity on every page: 1360px panel, lilac mask logo, styled email label, 10px "Back to Top". Load-time hash scrolls are now instant.
  - **Prompt:** Add `DiscoveryCallSection` and `Footer` to the portfolio page. Nav "Book a Call" targets the on-page section. Verify `/portfolio#gustav-case`-style deep links scroll to the same offset as the handover after the splash.
  - **Pixel check:** scroll landing position for each deep link (section top relative to the navbar), footer layout.
  - **Commit:** `feat(portfolio): wire discovery section and footer`

### Task 7 – Dedicated `/discovery-meeting` page ✅ `14e2275`

- **Result:** Navbar + `DiscoveryCallSection` + Footer. Title "Book a Discovery Call — Bonotech" and its own meta description (shared `usePageMeta` hook). "Book a Call" carries `aria-current="page"` and, like the footer link, scrolls on the page. Page views come from `AnalyticsTracker`. `firebase.json` is unchanged because `frameworksBackend` serves the SPA on every path.

- **Prompt:** Add a `/discovery-meeting` route rendering Navbar + `DiscoveryCallSection` + Footer, focused on booking (section visible above the fold). Set page title and meta description, track the page view in analytics, and confirm Firebase serves the route on direct load and refresh.
- **Pixel check:** the discovery section matches the home-page version (and the handover's visual shell) exactly. The navbar renders identically to the home page, with "Book a Call" marked as the current page.
- **Files:** `src/App.tsx`, new `src/pages/discovery-meeting/DiscoveryMeetingPage.tsx`, `firebase.json` (only if a rewrite is needed)
- **Done when:** `bonotech.io/discovery-meeting` opens directly to the booking form and submissions still send email.
- **Commit:** `feat: add dedicated /discovery-meeting scheduling page`

---

## 7. Verification checklist (every task)

- [ ] `npm run build` passes (tsc + vite)
- [ ] `npm run lint` passes
- [ ] Pixel check per §5: computed styles and geometry measured in both builds at the §5.3 breakpoints, within §5.2 tolerance
- [ ] Side-by-side screenshots at 1440px and 390px
- [ ] Hover, focus-visible, active and open states match
- [ ] Animation timing and reduced-motion behaviour match
- [ ] No console errors; no 404 assets
- [ ] Exceptions recorded in §5.5; Pixel-verified column updated in §2
- [ ] Commit only the files for that task

## 8. Out of scope / risks

- The handover's booking flow is preview-only; we keep the React email-backed submission (visual shell still matches).
- Newsletter and About "Get In Touch" tile destinations remain as-is.
- Portfolio is the largest item (~1,200 lines of demo JS/CSS); 6b/6c may need extra review rounds. Pixel checks of animated demos rely on matching elapsed time, so they may need paused or reduced-motion snapshots. From 6b onwards, demos are measured per chapter with transitions and animations frozen (`transition:none; animation:none`).
- Font rendering can differ by sub-pixels between machines; always compare both builds in the same browser.
- Firebase deploy is not part of this plan.
