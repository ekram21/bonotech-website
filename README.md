# Bonotech website

React, TypeScript, and Vite website hosted on Firebase Hosting.

## Local development

```sh
npm install
npm run dev
```

Run `npm run build` to type-check and create the deployable `dist/` directory. Run `npm run preview` to inspect that build locally.

## Deployment

```sh
npm run deploy:live
```

This command runs the complete build (`tsc -b`, `vite build`, and the portfolio HTML generator), then deploys `dist/` to Firebase Hosting. It changes the live site, so run it only when a live release is intended. Firebase CLI access to the `bonotech-website` project is required.

For the portfolio preview channel, run `npm run deploy:preview-portfolio`. It also runs the complete build before deploying and sets the channel to expire after 30 days.

## Scripts in `scripts/`

- `generate-portfolio-html.mjs` runs automatically at the end of `npm run build`. It copies `dist/index.html` to `dist/portfolio.html` and sets the portfolio title, description, canonical URL, and social sharing metadata. Firebase Hosting rewrites `/portfolio` to `/portfolio.html`, so this generated file is required for both preview and live deployments. The default public origin is `https://bonotech-website.web.app`; set `PORTFOLIO_PUBLIC_ORIGIN` when building for a different public origin.
- `render-portfolio-social-card.ps1` is an optional PowerShell asset generator. It uses `System.Drawing` and `src/assets/bonotech-logo-mono2.png` to recreate `public/portfolio-og.png`, the image used when the portfolio is shared. The PNG is committed to the repository and Vite copies it into `dist/`, so this script is only needed when changing or regenerating that image. It is not part of the normal build, deployment, or live site runtime. Run it from the repository root on a Windows system with `powershell -File scripts/render-portfolio-social-card.ps1`.
