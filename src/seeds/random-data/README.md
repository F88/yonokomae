# Random Data Seeds (for Demo & Prototyping)

This folder contains non-historical, demo-style seed data used for character bases (`neta`) and report defaults. This data is primarily used in `demo` modes and for prototyping.

Seeds are discovered at build time using static, eager imports via `import.meta.glob`.

- **TypeScript (Preferred):**
    - `src/seeds/random-data/neta/komae.ts`
    - `src/seeds/random-data/neta/yono.ts`
    - `src/seeds/random-data/report/config.ts`
- **JSON (Optional):**
    - `seeds/random-data/neta/komae.json`
    - `seeds/random-data/neta/yono.json`
    - `seeds/random-data/report/config.json`

## How to Update Neta Base Profiles (Komae/Yono)

Edit the TypeScript files under `src/seeds/random-data/neta/` to update the base profiles for Komae and Yono. These files export simple objects that are consumed by the demo repositories.

## How to Configure Report Defaults

Edit `src/seeds/random-data/report/config.ts` to adjust default values like `attribution` and `defaultPower`.

## Scenario Seeds Have Moved

**Note:** Scenario authoring is no longer done in this directory. All battle scenarios are considered historical evidence.

Please place all battle scenario seeds under:

- `src/seeds/historical-evidences/battle/*.ts`

See the `README.md` in that directory for instructions.

## Validation

To ensure all seeds are correctly structured, you can run the validation tests:

```bash
npm run test:seeds
```

See `docs/TESTING.md` for more details on testing.
