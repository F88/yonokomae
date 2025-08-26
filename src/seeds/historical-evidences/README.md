# Historical Evidences Seeds (File-based Battle Data)

This folder hosts authorable, file-based Battle data used by the
HistoricalEvidencesBattleReportRepository. These are per-battle files, not
random demo seeds, and are discovered at build/test time using eager
`import.meta.glob`.

- TS modules (preferred) live under:

    - `src/seeds/historical-evidences/battle/*.ts`

- Optional JSON files are supported under a project-root mirror path:

    - `seeds/historical-evidences/battle/*.json`

Both TS and JSON must expose a Battle-compatible object as the module default export.

## How to add a new Battle (TS recommended)

1. Create a new file in `src/seeds/historical-evidences/battle/`:
   - Example: `src/seeds/historical-evidences/battle/demo.ts`
1. Export a default object that satisfies the `Battle` type:

```ts
import type { Battle } from '@/types/types';

const battle: Battle = {
  id: 'demo-battle-001',
  title: 'Demo Historical Battle',
  subtitle: 'File-based sample',
  overview: 'A sample battle loaded from a TS file.',
  scenario: 'Two forces met at the river crossing and exchanged pleasantries.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Komae Demo',
    subtitle: 'Sample',
    description: 'Demo neta from file',
    power: 42,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Yono Demo',
    subtitle: 'Sample',
    description: 'Demo neta from file',
    power: 58,
  },
  provenance: [{ label: 'Demo Source', note: 'File-based test fixture' }],
  status: 'success',
};

export default battle;
```

1. Run tests to validate everything still passes:

- `npm test`

## JSON alternative

Create a file under `seeds/historical-evidences/battle/your-battle.json` with a
compatible shape. Vite will expose the parsed object as the module `default`.

```json
{
  "id": "your-battle-001",
  "title": "Your Historical Battle",
  "subtitle": "An example JSON entry",
  "overview": "Brief context.",
  "scenario": "Narrative goes here.",
  "komae": {
    "imageUrl": "about:blank",
    "title": "Komae",
    "subtitle": "Base",
    "description": "JSON profile",
    "power": 50
  },
  "yono": {
    "imageUrl": "about:blank",
    "title": "Yono",
    "subtitle": "Base",
    "description": "JSON profile",
    "power": 50
  },
  "provenance": [
    { "label": "Archive", "url": "https://example.org" }
  ],
  "status": "success"
}
```

## Naming conventions

- Filenames: `kebab-case` (e.g., `tama-river-bridge.json`, `bridge-skirmish.ts`)
- IDs: stable, unique per battle (e.g., `bridge-skirmish-001`)
- Keep code identifiers and product names in English; use ISO 8601 dates where applicable
- Avoid dynamic fields; values should be deterministic and sourced

## Minimal shape (Battle)

The repository expects at least these fields; missing bits are filled with
sensible defaults, but providing full data is recommended.

```ts
interface Battle {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  scenario: string;
  komae: {
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    power: number;
  };
  yono: {
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    power: number;
  };
  provenance?: Array<{ label: string; url?: string; note?: string }>;
  status?: 'loading' | 'success' | 'error';
}
```

Notes:

- TS is preferred for type checking at authoring time; JSON is supported for simple fixtures
- No manual registration is required; files are auto-discovered via eager `import.meta.glob`
- If multiple files exist and no specific filename is selected, the provider may pick one deterministically

## Troubleshooting

- If a new file is not loaded:

    - Ensure the file path matches one of the supported glob patterns
    - Ensure the object is the module `default` export

- Schema/type errors in TS: check your object satisfies `Battle`
- For JSON, validate the shape and field names match the `Battle` structure
