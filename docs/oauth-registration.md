# OAuth 2.0 Consumer Registration — Upload Stash Viewer

Instructions for registering the OAuth consumer needed by this application.

## Registration URL

```
https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose/oauth2
```

You must be logged in to your Wikimedia account.

## Form Fields — Exact Values to Use

| Field | Value |
|---|---|
| **Application name** | `Upload Stash Viewer` |
| **Application description** | See below |
| **OAuth version** | OAuth 2.0 |
| **Grant types** | Check: **Authorization Code**, **Refresh Token** |
| **Client is confidential** | **UNCHECK** (this is a public/frontend-only app) |
| **Applicable project** | `*` (all projects — needed for Commons + Meta auth) |
| **Callback URL** | See below |
| **Applicable grants** | `Edit existing pages`, `Create, edit, and move pages`, `Upload new files`, `Upload, replace, and move files` |
| **This consumer is for use only by [username]** | Leave **unchecked** for production (check for initial testing) |

### Application Description (copy-paste this)

```
Upload Stash Viewer is a browser-based tool that lets Wikimedia Commons users view and manage their upload stash. The upload stash is a temporary staging area (max 48 hours) for files that have been uploaded but not yet published.

This tool provides:
- A gallery view of all files currently in the user's upload stash
- Metadata status indicators (what's present vs. missing for publication)
- Tool suggestions based on file type for metadata enrichment
- The ability to edit metadata (wikitext, categories, structured data) and publish files to Commons

The tool runs entirely in the browser (no backend server). It uses OAuth 2.0 with PKCE for authentication. Source code: https://gitlab.wikimedia.org/daanvr/upload-stash-viewer
```

### Callback URLs

**For production (GitHub Pages):**
```
https://daanvr.github.io/upload-stash-viewer/
```

**For local development:**
```
http://localhost:5173/upload-stash-viewer/
```

> Note: You may need to register two consumers (one for production, one for development) or update the callback URL as needed. Wikimedia OAuth allows only one callback URL per consumer.

## After Registration

You will receive:
- **Client ID** (consumer key) — embed this in the app source code
- **Client Secret** — also embed in source code (see note below)

### Why the client secret is included in source code

This is a **non-confidential (public) client** — it runs entirely in the browser, so there is no way to keep a secret. The PKCE flow provides security instead of the client secret. However, due to a known limitation (Phabricator T323855), non-confidential clients may still need the client secret to use refresh tokens. Wikimedia developers recommend shipping it alongside the client ID and treating both as public values.

## Approval Timeline

- **Owner-only consumers** (checked "for use only by [username]"): work immediately, no review needed
- **Public consumers**: require admin review, typically a few days to two weeks

### Speeding Up Review

If you don't hear back within a few days:
1. Leave a message at [Steward requests/Miscellaneous](https://meta.wikimedia.org/wiki/Steward_requests/Miscellaneous) on Meta-Wiki
2. Ask on the `#wikimedia-tech` IRC channel (Libera Chat)
3. File a Phabricator task if needed

## Preloaded Registration Link

Use this link to open the registration form with fields pre-filled:

```
https://meta.wikimedia.org/w/index.php?title=Special:OAuthConsumerRegistration/propose&wpname=Upload+Stash+Viewer&wpdescription=Upload+Stash+Viewer+is+a+browser-based+tool+that+lets+Wikimedia+Commons+users+view+and+manage+their+upload+stash.+The+upload+stash+is+a+temporary+staging+area+(max+48+hours)+for+files+that+have+been+uploaded+but+not+yet+published.+This+tool+provides+a+gallery+view+of+stashed+files,+metadata+status+indicators,+tool+suggestions+for+metadata+enrichment,+and+the+ability+to+edit+metadata+and+publish+files+to+Commons.+Frontend-only,+OAuth+2.0+with+PKCE.+Source:+https://gitlab.wikimedia.org/daanvr/upload-stash-viewer&wpagreement=1
```

## Required OAuth Grants (Reference)

| Grant | Internal Name | Purpose |
|---|---|---|
| Edit existing pages | `editpage` | Edit file description pages after publication |
| Create, edit, and move pages | `createeditmovepage` | Create new file pages when publishing |
| Upload new files | `uploadfile` | Upload files to the stash and publish |
| Upload, replace, and move files | `uploadeditmovefile` | Replace/move files if needed |
