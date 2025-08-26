---
applyTo: '**'
---

# Documentation Principles

This repository uses bilingual documentation with English as the single source of truth.

- Keyboard shortcuts within an application should not be documented; they should be represented on the screen.


## DEVELOPMENT_EN.md / DEVELOPMENT_JA.md

### Source of truth

- `DEVELOPMENT_EN.md` is the canonical document. All content changes start here.
- `DEVELOPMENT_JA.md` must be an accurate Japanese translation of `DEVELOPMENT_EN.md`.
- The Japanese file must not introduce information that does not exist in the English file.

## Japanese typography rules

- Use half-width for numbers, Latin letters, and symbols.
- Keep product names, identifiers, and code in English.
- Dates use ISO 8601 format (e.g., `2025-08-26`).

- EN update: `docs(dev): update DEVELOPMENT_EN.md`
- JA sync: `docs(dev-ja): sync DEVELOPMENT_JA.md with <SHA>`
- Glossary: `docs(types): update glossary`
- If wording changes alter meaning materially: `docs(dev|dev-ja)!: ...` with a `BREAKING CHANGE:` footer explaining impact.
