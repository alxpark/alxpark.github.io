# WebAssembly Shelf

Public home for small WebAssembly apps and games, served by GitHub Pages at https://alxpark.github.io/.

Each app lives in its own folder as a self-contained `index.html` (the `.wasm` is embedded), so it is served at `https://alxpark.github.io/<folder>/`.

| App | Path | Source |
| --- | --- | --- |
| Ember Well | `/ember-well/` | private repo `alxpark/ember-well` |
| Pixel Run | `/pixel-run/` | private repo `alxpark/pixel-run` |
| CRATE-16 | `/crate16/` | private repo `alxpark/crate16` (`npm run build` → `docs/index.html`) |
| Lathe-4 | `/lathe4/` | private repo `alxpark/lathe4` |
| RETRO//TRACK | `/retrotrack/` | private repo `alxpark/retrotrack` (`./build.sh` → `dist/index.html`) |
| Stemline | `/stemline/` | private repo `alxpark/stemline` (`./build.sh` → `dist/stemline.html`) |

## Adding an app

1. Build the app to a single `index.html` and copy it to a new folder here.
2. Add a `cover.png` (portrait 9:16 works best).
3. Copy an entry in the root `index.html` and update its link and facts.
