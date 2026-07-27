# ONPS Update Counter

A static "days since last update" counter for [Oakridge Nuclear Power Station](https://www.roblox.com/games/15684145480/) on Roblox, in the spirit of the classic TF2 update counter.

- `index.html` / `style.css` / `script.js`: the static page. It reads `data.json` and ticks a live day counter client-side.
- `data.json`: hand-edited whenever a new update is posted in ONPS's `#announcements` Discord channel.
   - its hand edited cause the other solution requires a lot of overhead

## Updating after a new announcement

1. Open the new update message in Discord. Hover the timestamp at the top of the message to see the exact date/time (Discord shows it in your local time zone. Convert it to UTC, or just paste local time into an [ISO converter](https://www.timestamp-converter.com/)).
2. Edit `data.json`:
   - `updated`: when the update actually went out (from the Discord message timestamp).
   - `version`: the build/version number mentioned in the announcement, if any.
   - `editedAt`: when you made this edit (just use the current time).
   - `MajVersion`: the last major version (i.e. 0.26.8 BETA)

3. Commit and push. GitHub Pages picks up the change automatically (usually within a minute\*).
