# Random Data Seeds (Random Joke Data)

This folder hosts type-safe seed modules used by the Random Joke Data repository
and related prototyping flows. These are non-historical, demo-style seeds for
character bases (neta) and report defaults.
Seeds are discovered at build time using static, eager imports via `import.meta.glob`.

- TS modules are preferred for authoring and live under:
    - `src/seeds/random-data/neta/{komae,yono}.ts`
    - `src/seeds/random-data/report/config.ts`

- Optional JSON seeds are supported under the project root `seeds/` mirror:
    - `seeds/random-data/neta/{komae,yono}.json`
    - `seeds/random-data/report/config.json`

## Scenario seeds have moved (historical-evidences)

Scenario authoring under `random-data/scenario` is deprecated and no longer
used. Please place historical scenario seeds under:

- `src/seeds/historical-evidences/battle/*.ts` (preferred)
- `seeds/historical-evidences/battle/*.json` (optional)

See `src/yk/repo/core/battle-seed-loader.ts` and the historical-evidences
README for details. Use `npm test` to validate seeds and schema.

## How to update Neta base profiles (komae/yono)

- Preferred (TS): edit files under `src/seeds/random-data/neta/`:
    - `komae.ts`, `yono.ts` exporting simple objects consumed by the repo

- Optional (JSON): provide `seeds/random-data/neta/*.json` equivalents

## How to configure report defaults

- Preferred (TS): `src/seeds/random-data/report/config.ts` exporting `{ attribution, defaultPower }`

- Optional (JSON): `seeds/random-data/report/config.json`

## Naming conventions

- Scenario filenames: `kebab-case` matching the seed id prefix (e.g., `tama-river.ts`)
- Seed IDs: prefix with the filename stem and a 3-digit counter (e.g., `tama-river-001`)
- Keep titles in Title Case; keep code identifiers in English
- Use ISO 8601 dates where applicable

## Schema (HistoricalSeed)

The `HistoricalSeed` shape is enforced at build/test time. Minimal schema:

```ts
export interface HistoricalSeed {
    id: string; // unique across all seeds
    title: string;
    subtitle?: string;
    overview?: string;
    narrative?: string;
    provenance?: Array<string | { label: string; url?: string; note?: string }>;
}
```

Notes:

- IDs must be globally unique; tests will fail if duplicates are detected.
- Prefer TS modules to catch type errors early; JSON is supported but not preferred.
- No manual registration: files are auto-discovered by `import.meta.glob`.

## Troubleshooting

- If a new seed doesn't appear, ensure the file path matches one of the glob patterns and the default export exists.
- Vite may warn about dynamic imports if paths change; we use eager static imports to avoid mixed static/dynamic references.
- Use `npm run test` for the full suite; see `docs/TESTING.md` for details.
