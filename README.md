# AI Futures Goa — Coming Soon site
Static HTML/CSS/vanilla JS. No build step, no frameworks, no external libraries (the map is a canvas atlas, so there are no tiles to fail; a CSS gradient fallback shows if canvas is unavailable).

## Run locally
`python3 -m http.server` in this folder, then open http://localhost:8000

## Connect Google Sheets (free)
1. Create a Google Sheet. Extensions → Apps Script. Paste `apps-script/Code.gs`.
2. Run `setup` once (authorise). It creates `Submissions` plus ten filtered tabs (Delegates, Speakers, etc.).
3. Deploy → New deployment → Web app. Execute as: **Me**. Access: **Anyone**. Copy the URL.
4. Paste the URL into `js/config.js` as `endpoint`. Set `enableDemoMode:false` for production.
Each submission is stored once in `Submissions`; the category tabs are QUERY views, so multi-category entries are never duplicated or lost. The same reference ID is reused on retry and the script ignores repeats.

## Other providers
Formspree/HubSpot/Airtable/webhooks: set `endpoint` to a URL that accepts a JSON POST and returns `{"ok":true}`. Adjust `waitlist.js` `submit()` if the provider uses a different response shape.

## Modes
- **Demo** (empty endpoint): validates, shows a banner and a DEMO confirmation. Nothing is saved.
- **Live**: success is shown only after the endpoint returns `ok:true`; otherwise a retry message appears.

## Security
Client validation is a convenience only. `Code.gs` re-validates server-side; for production add rate limiting or a CAPTCHA (e.g. Cloudflare Turnstile) and replace the placeholder privacy notice.

## Deploy to GitHub Pages
Push the folder to a repo → Settings → Pages → Deploy from branch `main` / root. Cloudflare Pages: connect the repo, no build command, output directory `/`.
