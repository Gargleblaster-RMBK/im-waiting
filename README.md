# ONPS Update Counter

A static "days since last update" counter for [Oakridge Nuclear Power Station](https://www.roblox.com/games/15684145480/) on Roblox, in the spirit of the classic TF2 update counters.

- `index.html` / `style.css` / `script.js` — the static page. It reads `data.json` and ticks a live day counter client-side.
- `data.json` — hand-edited whenever a new update is posted in ONPS's `#announcements` Discord channel.

No build step, no bot, no server — just static files plus a file you edit by hand.

## Updating after a new announcement

1. Open the new update message in Discord. Hover the timestamp at the top of the message to see the exact date/time (Discord shows it in your local time zone — convert to UTC, or just paste local time into an [ISO converter](https://www.timestamp-converter.com/)).
2. Edit `data.json`:

   ```json
   {
     "updated": "2026-07-15T14:32:00.000Z",
     "version": "0.26.13",
     "editedAt": "2026-07-15T15:00:00.000Z"
   }
   ```

   - `updated` — when the update actually went out (from the Discord message timestamp).
   - `version` — the build/version number mentioned in the announcement, if any.
   - `editedAt` — when you made this edit (just use the current time).

3. Commit and push. GitHub Pages picks up the change automatically (usually within a minute).

## Setup

1. Push this repo to GitHub.
2. Under **Settings → Pages**, set the source to "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site will be live at `https://<user>.github.io/<repo>/`.
