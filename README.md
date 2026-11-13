# Gig log

[Live site](https://crvouga.github.io/gig-log/)

Edit `gigs.yaml` directly. Keep records oldest to newest. Each record supports links, entity references, tags, and notes. This is the only gig data file; no syncing or generated data.

Run `scripts/verify.sh` (Node 22+) before committing. Pushes to `main` deploy to GitHub Pages. Preview with `python3 -m http.server`.

See [CLAUDE.md](CLAUDE.md) for editing instructions. YAML parsing uses vendored js-yaml 5.5.0 under its MIT license.
