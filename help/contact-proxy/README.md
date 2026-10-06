# Contact proxy (DIY)

Keeps `julerobb1@gmail.com` off memegames.net HTML so scrapers/indexers don’t harvest it.

## What it does

Static Help form → this Google Apps Script Web App → your Gmail.

## Deploy (once, ~2 minutes)

1. Open [script.google.com](https://script.google.com) signed into the inbox that should receive bookings.
2. New project → paste `Code.gs`.
3. Optional: Project Settings → Script properties → `FORWARD_TO` = your real address (otherwise uses the default in the file — change it before deploy if needed).
4. Deploy → New deployment → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web app URL (`…/exec`).
6. Put it in `help/contact-proxy-config.js` as `window.HELP_CONTACT_PROXY`, commit, merge to `release/production`.

Until the URL is set, the Help form tells people to text instead.

## Test

```bash
curl -s -X POST "$URL" -H 'Content-Type: application/json' \
  -d '{"name":"Test","phone":"501-555-0100","message":"proxy smoke test","os":"Win11"}'
```

Expect `{"ok":true}` and a mail in the inbox.
