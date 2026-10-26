# API Notes & Best Practices

Details of the request layer that are easy to miss and expensive to debug. Read this before writing any provisioning or automation scripts against the REST API.

## Send a Conventional User-Agent

Hosted instances sit behind a web application firewall that blocks non-browser automation user agents on **write** requests. Default `Python-urllib/*`, `python-requests/*`, and spoofed browser strings get a `403 error code: 1010`.

Always send a conventional client user agent:

```bash
curl --header 'User-Agent: curl/8.5.0' \
     --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
     --url 'https://your-domain.com/items/posts'
```

GET requests are unaffected — this only bites on POST/PATCH/DELETE.

## URL-Encode Filter Parameters

Filter parameters with raw brackets intermittently fail through the edge proxy. Always URL-encode them:

```
# Fragile
/items/posts?filter[status][_eq]=published

# Reliable
/items/posts?filter%5Bstatus%5D%5B_eq%5D=published
```

## Missing Fields Return 403, Not 404

`GET /fields/{collection}/{missing}` returns `403 FORBIDDEN` rather than `404`. Do not treat a non-200 response as "doesn't exist". For existence checks, list `GET /fields/{collection}` and search the results — or simply POST and tolerate a `400`.

## Write Effects Are Asynchronous

Flows triggered by a write run **after** the response is sent. If an `items.create` flow stamps a serial number, the POST response will show that field as `null`; the stamped value appears a few seconds later. Always re-fetch an item before verifying derived fields.

## Creating at a Final Status Skips Update Flows

Flows that trigger on `items.update` do not run when an item is created directly in its final state — only `items.create` flows fire. When seeding or importing already-completed records, set the fields those flows would have stamped (timestamps, computed amounts, expiry dates) explicitly in the create payload.

## "Read Only" Is a UI Concept

A field marked `readonly` in the interface still accepts explicit values over the API with a sufficiently privileged token. This is how seed and migration scripts backdate records — for example, writing historical `created_at` or completed-at timestamps.

## Config Endpoints Do Not Deduplicate

`/panels`, `/dashboards`, `/flows`, and `/operations` happily create duplicates on repeat POSTs. Always GET-filter by name (and by dashboard, for panels) before creating. Build a chain tail-first: POST operations, then PATCH `flow.operation` to the first operation's id.

## Never PATCH Relations — It Can Take the Server Down

`PATCH /relations/{collection}/{field}` can crash the server process outright on affected versions — a bug in the schema-mutation path exits the process mid-request. This applies to **any** relation PATCH, even a correct, verified payload. `POST /relations` is safe.

**If your instance went down after a relation PATCH:**

- **Dev server (nodemon)** — it does *not* auto-restart; type `rs` + Enter in its console.
- **Docker** — `docker compose restart` (or `up -d`) the backend container.
- **Hosted** — the platform restarts the process automatically; allow a moment and retry, or contact support if it persists.

**To change relation behavior safely, never PATCH — do one of these instead:**

1. Delete and recreate the relation with the desired options, or
2. Apply the change at the database level through the [SQL Query operation](/guides/automation-recipes#the-sql-query-operation) and then clear the system schema cache:

```bash
curl --request POST \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"cache":"system"}' \
  --url 'https://your-domain.com/utils/cache/clear'
```

## Write Provisioning Scripts, Not One-Liners

Two recurring failure modes argue for keeping provisioning logic in script files rather than inline shell commands:

- **Shell `$` expansion corrupts payloads.** `curl --data "{...$trigger...}"` inside double quotes silently strips `$trigger`, `$last`, and `$full` template tokens — the flow then stores mutilated options and dies silently.
- **Encoding.** On Windows, default file encodings corrupt JSON fetched over HTTP (smart quotes become `?`). Open responses with an explicit `utf-8` encoding.

An idempotent Python or Node script — GET, compare, POST/PATCH only what differs — is far more reliable than a pile of curl calls.
