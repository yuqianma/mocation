# mocation

`mocation` (move + location) is a daily GPS visualization app.

This project was migrated from Vue 2 to:

- Vite
- React
- Tailwind + shadcn/ui-style components
- Mapbox GL JS

## Features

- LeanCloud login (`/login`) with persisted session token in `localStorage`
- Optional one-click dev login from env credentials
- Protected dashboard route (`/`)
- Date range + time window query controls
- Map rendering with:
  - gradient GPS track line
  - GPS point layer
  - auto fit bounds to current results
- Abnormal point filtering preserved from legacy logic

## Environment Variables

Use `.env.local` for local development.
You can copy variable names from `.env.example`.

Required variable names:

- `VITE_LC_ID`
- `VITE_LC_KEY`
- `VITE_API_BASE_URL`
- `VITE_MAPBOX_ACCESS_TOKEN`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Mapbox token must be present in env (`VITE_MAPBOX_ACCESS_TOKEN`).
- Backup env file `.env.bk.local` is intentionally not used/modified by this migration.
