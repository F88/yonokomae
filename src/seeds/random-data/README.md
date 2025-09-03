# Random Data Seeds (for Demo & Prototyping)

This folder contains non-historical, demo-style seed data used for character bases (`neta`), scenarios, and report defaults. This data is primarily used in `demo` modes (demo-ja, demo-en, demo-de) and for prototyping.

Seeds are discovered at build time using static, eager imports via `import.meta.glob`.

## Structure

### TypeScript Files (Preferred)

- **Neta (Character Profiles):**
    - `src/seeds/random-data/neta/komae.ts` - Base Komae profile
    - `src/seeds/random-data/neta/yono.ts` - Base Yono profile
    - `src/seeds/random-data/neta/komae.ja.ts` - Japanese localized Komae profile
    - `src/seeds/random-data/neta/yono.ja.ts` - Japanese localized Yono profile
    - `src/seeds/random-data/neta/komae.en.ts` - English localized Komae profile
    - `src/seeds/random-data/neta/yono.en.ts` - English localized Yono profile

- **Scenarios (Battle Narratives):**
    - `src/seeds/random-data/scenario/*.ts` - Base scenarios
    - `src/seeds/random-data/scenario/*.ja.ts` - Japanese localized scenarios
    - `src/seeds/random-data/scenario/*.en.ts` - English localized scenarios

### JSON Files (Optional)

JSON alternatives can be placed under the project-root mirror path:

- `seeds/random-data/neta/*.json`
- `seeds/random-data/scenario/*.json`

## How to Update Neta Base Profiles (Komae/Yono)

Edit the TypeScript files under `src/seeds/random-data/neta/` to update the base profiles for Komae and Yono. These files export simple objects that are consumed by the demo repositories. For localized versions, edit the corresponding `.ja.ts` or `.en.ts` files.

## How to Add or Update Scenarios

Create or edit TypeScript files under `src/seeds/random-data/scenario/`. Each file should export a scenario object compatible with the demo mode requirements. Use language-specific file extensions (`.ja.ts`, `.en.ts`) for localized content.

## Historical Evidence Seeds

**Note:** Historical battle data based on real evidence is stored separately.

For historical evidence data, please use:

- `src/seeds/historical-evidences/battle/*.ts`

See the `README.md` in that directory for instructions on contributing historical evidence.

## Validation

To ensure all seeds are correctly structured, you can run the validation tests:

```bash
npm run test:seeds
```

See `docs/TESTING.md` for more details on testing.
