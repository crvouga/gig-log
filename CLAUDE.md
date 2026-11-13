# Editing the gig archive

`gigs.txt` is the authoritative original wording: title, blank line, then one show per line (`date place/notes`, free text). Preserve every byte of existing lines, including trailing spaces. Never reformat, re-sort, spell-correct, deduplicate, or normalize existing text. Only edit an existing line when explicitly requested, and change only the requested portion.

The website reads `data/gigs.json`. This is the structured content and enrichment store. Each gig has a permanent `id`, nullable ISO `date`, exact original `text`, `links` (`{label,url}` objects), `entityIds`, `tags`, and optional free-text `notes` (empty string by default). Top-level `entities` holds reusable `{id,type,name,links}` records. Types may be `venue`, `artist`, `person`, `festival`, or another useful category. Do not infer identities from spelling variants without confirmation. Only HTTP/HTTPS links are allowed. Do not change IDs when editing dates or text.

To add a show, add one line to gigs.txt in date order without touching other lines, then run `python3 scripts/sync.py`. This imports new lines and preserves existing IDs/enrichment. For an explicitly requested existing-line correction, also update that record's `text` and (if relevant) `date` in JSON before running sync. Sync refuses unmatched old lines to prevent metadata loss. To associate data, edit JSON only; the source text stays untouched.

Example entity: `{"id":"venue-example","type":"venue","name":"Confirmed venue name","links":[{"label":"Website","url":"https://example.com"}]}`. Reference its ID in a gig's `entityIds`. Add recordings, tickets, photos, or posters to the gig's `links`. Add tags or notes as needed. These are displayed and searchable (links are displayed; names, tags and notes are searched).

After edits, run `git diff --stat` and inspect `git diff` to confirm only requested lines/metadata changed. Run `scripts/verify.sh` (Node 22+). Commit messages: `Add show: 1/16/2027 ...` or `Edit show: 3/14/23 (fix venue name)`.

Plain static HTML/CSS/JS; no framework, dependencies, or build. `app.js` fetches JSON; `model.mjs` groups and renders each gig exactly once. Original text uses textContent and preserved whitespace. Dates after the visitor's local today appear in Upcoming, unparsed dates in Other. Search intentionally reduces visible count. Preview with `python3 -m http.server` and open localhost:8000. Pushes to main run verification and deploy GitHub Pages through `.github/workflows/pages.yml`. Never include secrets in this public repo.
