# Upload Stash Viewer

A web-based tool for browsing and managing your [Wikimedia Commons upload stash](https://commons.wikimedia.org/wiki/Commons:UploadStash). The upload stash is a temporary staging area where files wait before being published to Commons. The built-in [Upload Wizard](https://commons.wikimedia.org/wiki/Special:UploadWizard) provides **no access** to your stash — this tool fills that gap.

**Status:** In development (hackathon project, [Wikimedia NWE Hackathon 2026](https://meta.wikimedia.org/wiki/Wikimedia_Hackathon_2026))

## Why This Tool Exists

When uploading files to Wikimedia Commons, the upload stash serves as a central hub where files land before publication. But there is no good way to:

- See what's currently in your stash
- Know how much time remains before files expire (48-hour limit)
- Get guidance on which tools to use for enriching metadata
- Edit metadata and publish directly from the stash

This viewer acts as a **cockpit** for the stash-based upload pipeline, giving you oversight and steering you to the right tools.

## Features (Planned)

### Core — Stash Browser
- OAuth login with your Wikimedia account
- View all files in your upload stash as a gallery with thumbnails
- See file type, size, dimensions, MIME type
- Countdown timer showing time remaining before 48-hour expiry
- Sort and filter stashed files

### Metadata Status & Editing
- Show metadata completeness: what's present vs. what's missing for publication
- Three-tier validation:
  - **Legally required**: author, source, license
  - **Community best practice**: description, categories, date
  - **Technically required**: meaningful filename
- Inline metadata editor (wikitext)
- Category browser/search
- Structured Data on Commons (SDC) editing

### Tool Suggestions
Based on file type and content, suggest the best tools for each stage:

**Pre-stash** (getting files into the stash):
- iPhone/macOS Photos upload
- Flickr2Commons
- Immich export

**Post-stash** (enriching metadata before publication):
- Category tree navigator
- Wikitext builder with templates
- Map visualization for geo-metadata
- Advanced reconciliation (Wikidata)

**Publication**:
- Publish directly from this tool
- Or redirect to Upload Wizard, Pattypan, OpenRefine, etc.

### Publish to Commons
- Assemble metadata (wikitext + SDC) and publish stashed files
- Preview the file description page before publishing
- Batch publish support

## Technical Stack

- **Frontend-only** — runs entirely in the browser, no backend server
- **Vite** — build tooling
- **Vanilla JavaScript** — no framework
- **Wikimedia OAuth 2.0** — PKCE flow for public clients
- **Deployed on** GitHub Pages
- **Primary repo** on GitLab Wikimedia, mirrored to GitHub

## Development

```bash
npm install
npm run dev        # http://localhost:5173/upload-stash-viewer/
npm run build
npm run preview
```

## OAuth Setup

This tool requires a registered OAuth 2.0 consumer on Wikimedia. See [`docs/oauth-registration.md`](docs/oauth-registration.md) for detailed registration instructions.

## API Endpoints Used

| Operation | Endpoint |
|---|---|
| List stashed files | `action=query&list=mystashedfiles` |
| Stash file details | `action=query&prop=stashimageinfo` |
| Upload to stash | `action=upload` with `stash=1` |
| Publish from stash | `action=upload` with `filekey=<KEY>` |
| User profile | OAuth 2.0 profile endpoint |

## Related Projects

- [Metadata Enrichment Map](https://gitlab.wikimedia.org/daanvr/metadata-enrichment-map) — sibling project for geo-based metadata enrichment
- [Upload Wizard](https://commons.wikimedia.org/wiki/Special:UploadWizard) — built-in Commons upload tool
- [Pattypan](https://github.com/yarl/pattypan) — batch upload via spreadsheet
- [go-to-commons](https://github.com/simon04/go-to-commons) — CLI upload tool

## License

MIT
