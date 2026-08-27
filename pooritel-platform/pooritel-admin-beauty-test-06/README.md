# PooriTel Admin — Beauty Test 06

Independent visual/admin architecture test combining the operational information model of `pooritel-admin-preview` with the living background-core language of `pooritel-admin-beauty-test-05`.

## Run

```bash
npm install
npm run dev
```

Vite runs on port `5278`.

## Build

```bash
npm run build
```

## Notes

- Independent preview only; it is not connected to the production customer dashboard.
- Includes FA/EN language toggle and Light/Dark theme toggle.
- The animated background core is rendered only on Overview.
- Sidebar contains the full Admin control surface and has desktop collapse + mobile open/close behavior.
