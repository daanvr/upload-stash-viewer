# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Upload Stash Viewer** is a frontend-only web tool that serves as a "cockpit" for managing your work-in-progress uploads on Wikimedia Commons. It lets authenticated users browse their upload stash, see thumbnails and metadata status, get tool suggestions based on file type, enrich metadata, and publish files to Commons — all things the built-in Upload Wizard does not support.

## Repository & Deployment

- **Primary repo**: GitLab Wikimedia — `gitlab.wikimedia.org/daanvr/upload-stash-viewer`
- **Mirror**: GitHub — `github.com/daanvr/upload-stash-viewer` (for GitHub Pages hosting)
- **Deployment**: GitHub Pages — static frontend only, no backend server
- All API calls happen client-side (Wikimedia APIs)

## Architecture

### Authentication

OAuth 2.0 with PKCE (Authorization Code flow, non-confidential/public client). Required for all stash operations since stashed files are tied to a user account.

- Authorization server: `meta.wikimedia.org`
- OAuth registration: `https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose/oauth2`
- See `docs/oauth-registration.md` for the registration form details

### Core Features

1. **Stash Browser** — View all files in your upload stash with thumbnails, file type, size, upload time, and time remaining (48h expiry countdown)
2. **File Detail View** — View full metadata for a stashed file (EXIF, dimensions, MIME type, SHA-1)
3. **Metadata Status** — Show what metadata is present vs. missing for publication (legal requirements, community best practices)
4. **Tool Suggestions** — Based on file type/content, suggest appropriate tools for enrichment (e.g., artworks → specialized workflow, street photos → Curator Tool, GLAM batches → OpenRefine/Pattypan)
5. **Metadata Editor** — Edit file description (wikitext), set categories, add structured data
6. **Publish to Commons** — Publish stashed files with assembled metadata via the MediaWiki API

### Key Constraints

- **No backend** — everything runs in the browser. Use PKCE flow, never embed client secrets server-side.
- **48-hour stash expiry** — files auto-delete from the stash. The UI must prominently show time remaining.
- **CORS** — Wikimedia APIs require `crossorigin=` parameter (empty, in URL query string) for authenticated requests. For unauthenticated: `origin=*`.
- **Rate limits** — include a descriptive `User-Agent` header, avoid parallel bulk requests, cache responses.

## Wikimedia API Reference

### Upload Stash Endpoints

| Operation | API Call |
|---|---|
| List stashed files | `action=query&list=mystashedfiles&msfprop=size\|type` |
| Get stash file info | `action=query&prop=stashimageinfo&siifilekey=<KEY>&siiprop=timestamp\|url\|metadata\|mime\|sha1\|size` |
| Upload to stash | `action=upload&filename=<NAME>&stash=1` (with file in POST body) |
| Publish from stash | `action=upload&filename=<NAME>&filekey=<KEY>&text=<WIKITEXT>` |
| Get CSRF token | `action=query&meta=tokens&type=csrf` |

### OAuth 2.0 Endpoints

| Purpose | URL |
|---|---|
| Authorization | `https://meta.wikimedia.org/w/rest.php/oauth2/authorize` |
| Token Exchange | `https://meta.wikimedia.org/w/rest.php/oauth2/access_token` |
| User Profile | `https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile` |

### Required OAuth Grants

- `editpage` — Edit existing pages
- `createeditmovepage` — Create, edit, and move pages
- `uploadfile` — Upload new files
- `uploadeditmovefile` — Upload, replace, and move files

## Development

### Stack

Vite + vanilla JS (no framework). Same stack as the sibling project metadata-enrichment-map.

### Build & Run

```bash
npm install        # Install dependencies
npm run dev        # Dev server at http://localhost:5173/upload-stash-viewer/
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

### Source Structure

- `src/main.js` — Entry point
- `src/api/oauth.js` — OAuth 2.0 PKCE flow (login, callback, token management)
- `src/api/commons.js` — Commons API wrapper (stash operations, publish, CSRF tokens)
- `src/ui/stash-view.js` — Stash gallery/list with thumbnails and expiry countdown
- `src/ui/file-detail.js` — Individual file detail panel
- `src/ui/metadata-form.js` — Metadata editing (wikitext, categories, SDC)
- `src/ui/tool-suggest.js` — Tool suggestion engine based on file type/content

### Metadata Format

Publication metadata is assembled as **Wikitext** — the file description page content. The minimum viable wikitext includes:

```wikitext
=={{int:filedesc}}==
{{Information
|description={{en|1=Description here}}
|date=2026-03-14
|source={{own}}
|author=[[User:Daanvr|Daan van Ramshorst]]
}}

=={{int:license-header}}==
{{cc-by-sa-4.0|Daan van Ramshorst}}

[[Category:Example category]]
```

### SDC Write Format

When generating `wbeditentity` payloads for Structured Data on Commons, use `"claims"` (not `"statements"`) in the data JSON.
