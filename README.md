# UX Defect Analysis Frontend Fixture

This repo contains a frontend-only website built for the Microsoft Clarity UX defect analysis workflow. It is intentionally designed as a realistic B2B product surface with enough interaction ambiguity, page variety, responsive differences, and client-side failures to exercise the workflow without producing hundreds of downstream tickets.

The application is a Vite React SPA. It has no backend and can be hosted directly on Vercel.

## Pages Included

- `/` - workspace overview
- `/pricing` - plan selection and comparison
- `/checkout` - payment and onboarding flow
- `/dashboard` - analytics workspace
- `/support` - help center and assistant
- `/account` - profile, permissions, and billing settings

## Local Commands

```bash
npm install
npm run dev
npm run build
```

## Fixture Notes

The app includes deliberate UX defects and ambiguous behaviors for later Clarity, Figma, Linear, Google Sheets, and Teams mock-data setup. Component identifiers are attached with `data-defect-id`, `data-component`, and `data-page` attributes so future seed data can map cleanly to UI elements.

## Microsoft Clarity

The production fixture is registered in Microsoft Clarity as `UX-Defect-Analysis`.

- Project ID: `xntb26qly8`
- Project URL: `https://clarity.microsoft.com/projects/view/xntb26qly8`
