# PooriTel — Wrangler Base

This is the current modular frontend/Worker base for PooriTel.

## Structure

- `public/` — all browser-facing assets
- `public/css/style.css` — styles
- `public/js/app.js` — interactions
- `public/js/i18n.js` — language switching
- `public/locales/fa.json` — Persian translations
- `public/locales/en.json` — English translations
- `public/images/` — site images
- `src/index.js` — Cloudflare Worker entry point
- `wrangler.jsonc` — Wrangler configuration

## Local development

1. Install Node.js LTS.
2. Open a terminal in the project root.
3. Run `npm install`.
4. Run `npx wrangler login`.
5. Run `npm run dev`.
6. Open the local URL shown by Wrangler.

## Deploy

Run:

`npm run deploy`

The Worker and `public/` assets are deployed together.

## Important

Put the real `gaming.jpg` file at `public/images/gaming.jpg` before testing the product images.

This is still a frontend prototype. Product data, seller verification, reputation, payments, auth and database are not connected yet.

Auth prototype added: /pages/auth.html with Email/Gmail, Phone OTP, Telegram and Steam entry points. This phase is UI-only; provider OAuth and backend sessions are not connected yet.
