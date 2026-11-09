# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

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
