# Public Endpoints & Portals

Building unauthenticated endpoints — request forms, status tracking, document verification — with webhook flows and a small static frontend.

## Public Webhook Flows

A webhook-triggered flow becomes a public API endpoint:

```jsonc
{
  "trigger": "webhook",
  "accountability": "all",          // public access
  "options": { "method": "POST" }   // or "GET" (default)
}
```

- **GET** `/flows/trigger/{id}` invokes the flow. **POST** works only when `options.method` is `"POST"` — a GET-only flow 403s on POST.
- Request data arrives as `data.$trigger.body` (POST) or `data.$trigger.query` (GET).
- The **last operation's return value is the response body**.
- A thrown error produces an empty `{}` response — clients should treat that as not-found/failed.

## The Validate → Query → Respond Chain

Never interpolate request input into SQL unescaped. The working pattern:

1. **`validate`** — a Run Script op that checks required fields and escapes strings:

   ```js
   module.exports = async function (data) {
     const b = data.$trigger.body;
     if (!b.name || !b.ref) throw new Error('missing fields');
     return {
       name: String(b.name).replace(/'/g, "''"),
       ref: String(b.ref).replace(/'/g, "''")
     };
   };
   ```

2. **`query`** — a `likha_sql` op interpolating the sanitized values (<code v-pre>{{validate.name}}</code>).

3. **`respond`** — a Run Script op returning only what the caller should see. Mask anything sensitive.

## Raw SQL INSERTs Emit No Events

A `likha_sql` INSERT does not fire `items.create` — your serial-numbering and timestamp flows are bypassed. Compute those fields inside the INSERT itself (a CTE that derives the next serial and stamps `due_date` works well) so public submissions get the same fields as app-created rows.

## Shared-Secret Tracking

For customer-facing status pages, a reference number alone is enumerable — pair it with a shared secret, for example the customer's mobile number. The tracking endpoint validates `ref + mobile` together and only then returns the record.

## Mask PII in Responses

Verification endpoints should return the minimum needed to confirm a hit — for example a masked holder name:

```sql
SELECT first_name || ' ' || left(last_name, 1) || '.' AS holder
```

Never return full personal records from a public flow.

## The Portal Pattern

A lightweight public frontend pairs naturally with these endpoints:

- A static SPA (Vite + React) with routes like `/`, `/request`, `/track/:ref/:key`, `/verify/:serial`.
- On static hosts (e.g. GitHub Pages) add an SPA fallback: a `404.html` that bounces to `index.html` via `sessionStorage`, with the app's `basename` set to its path.
- Print templates link to `/verify/:serial` via QR — see [Print Templates](/guides/print-templates#qr-verification-codes).
- A verify endpoint can UNION several collections (released documents, valid permits) so one URL verifies every printable artifact.
