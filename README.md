# STRATAGEM TRAINER v1.0

PC-first React + TypeScript + Vite prototype for a Helldivers 2-inspired stratagem input trainer.

## Run locally

1. Install Node.js 20 or newer.
2. Extract this archive.
3. Open a terminal in `stratagem-trainer`.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Included

- Main menu, training, loadout, records, and settings screens
- WASD directional input
- Practice and 10-item Challenge modes
- Wrong input resets the current sequence; timer continues
- Individual best-time records stored in browser LocalStorage
- Four color themes
- Loadout search, category filtering, select all, and clear
- Responsive layout with desktop-first design

## Data accuracy note

`src/data.ts` contains a starter catalog with representative stratagem entries and sequences. It is intentionally data-driven, but it is **not yet a verified exhaustive catalog of every stratagem currently available in Helldivers 2**. Before treating this as a complete reference tool, verify every entry and sequence against the current in-game stratagem menu and add any missing entries. The sequence data is kept separate from the game logic to make that update straightforward.

## Notes

- Records are local to the browser and do not sync between devices.
- Clearing browser site data may remove records.
- The project is fan-made and is not affiliated with Arrowhead Game Studios or Sony.
- Use original or appropriately licensed artwork and audio for any public deployment.
