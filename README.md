# Gig log

[Live archive](https://crvouga.github.io/gig-log/) · [Original list](gigs.txt) · [Structured data](data/gigs.json)

126 performances at initial import, presented as a searchable, year-grouped archive with upcoming shows, responsive layout, and automatic light/dark mode.

To add a show, add one line in date order to `gigs.txt` without modifying any existing line, run `python3 scripts/sync.py`, then `scripts/verify.sh`. Commit both files and push to `main`; GitHub Actions verifies and deploys the site. Run `python3 -m http.server` for a local preview.

To add links or relationships, edit the gig's record in `data/gigs.json`: `links` holds `{label,url}` objects; `entityIds` references reusable records in the top-level `entities` array. Each entity has `id`, `type`, `name`, and `links`. Gigs also support `tags` and `notes`. Stable IDs preserve associations across imports. Artist/venue identities have deliberately not been guessed from free text. See [CLAUDE.md](CLAUDE.md) for the complete editing protocol.

Original import SHA-256: `f3f73213082c19ccc177edd349c500f75268b8fbe6c71bebddbf0584b4dbf240` (6813 bytes, 128 lines, UTF-8/LF). The importer preserves original text and trailing spaces.
