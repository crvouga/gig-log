# Gig log

`gigs.yaml` is the only source of gig data. Edit it directly. No text/JSON copies, generated data files, or synchronization scripts. Keep gigs ordered oldest to newest by ISO `date`, with undated records last. Keep wording and whitespace inside `text` unchanged unless the user requests a specific correction. Store the date only in `date`, never as a prefix in `text`.

Each gig has a permanent `id`, optional ISO `date` string, `text`, `links` (`{label,url}` objects), `entityIds`, `tags`, and `notes`. Omit empty fields (including empty arrays, empty strings, and null). Missing links, entityIds, tags, notes, and entities are treated as empty. Omit date for undated records. Keep IDs stable. Quote dates and text. Preserve trailing spaces inside quoted text. Add a new show as one record in chronological position.

Reusable entities live in the same YAML file's `entities` array as `{id,type,name,links}` records. Reference their IDs in `entityIds`; never duplicate an entity per gig. Types can include artist, venue, person, or festival. Do not guess ambiguous identities. Links must use HTTP/HTTPS.

The page fetches YAML directly using the vendored js-yaml 5.5.0 parser (MIT). No build, conversion or sync step. `model.mjs` groups and renders the records; `app.js` handles loading, filtering and theme preference. All page copy belongs inline in `index.html`, not in the gig data. Keep language concise. Theme defaults to the system setting; Light/Dark override it and persist locally.

Run `scripts/verify.sh` with Node 22+ after edits. Inspect `git diff --stat` and `git diff` to confirm only requested data changed. Preview using `python3 -m http.server`. GitHub Actions verifies and deploys pushes to main. Include only static assets and the single YAML file in deployment.
