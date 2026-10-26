# Automation Recipes

Flow and operation patterns for real automation: numbering schemes, event gates, webhooks, and raw SQL. For trigger and operation basics, see the [Automation](/automation/) section.

## Event Trigger Options

An event hook flow's `options` object has two separate lists — putting collection names in `scope` makes the flow **never fire, silently**:

```json
{
  "type": "action",
  "scope": ["items.create"],
  "collections": ["app_orders", "app_invoices"],
  "async": true
}
```

`scope` holds event names; `collections` holds collection names. Because <code v-pre>{{$trigger.collection}}</code> interpolates the firing collection's name, one dynamic flow can serve many collections.

## `$trigger` Shape

For `items.update` events the trigger payload is:

```json
{ "payload": { "...changed fields..." }, "keys": ["<id>"], "collection": "...", "event": "items.update" }
```

`payload` is **not** double-nested — <code v-pre>{{$trigger.payload.status}}</code>, not <code v-pre>{{$trigger.payload.payload.status}}</code>.

## Gate Logic Inside Run Script, Not Conditions

The Condition operation can silently misbehave; the reliable gate is a Run Script operation that `throw`s. A thrown error routes to the operation's `reject` path — leave it `null` and the chain stops cleanly.

## Resolve/Reject Targets Are Unique

Two operations cannot resolve to the same target, and an operation's existing `resolve` link must be cleared before it can point somewhere new. When inserting an operation into a chain, unlink the previous `resolve` first.

## Prevent Self-Trigger Loops

Any operation that writes back to the same collection that triggered the flow must set `emitEvents: false`. Without it the write re-fires the event and loops.

## The `key` Field on Update Operations

On item-update operations, `key` accepts a literal id or a template — <code v-pre>{{$last.key}}</code> and <code v-pre>{{$trigger.keys[0]}}</code> both resolve.

## Serial Numbering

The standard `PREFIX-YYYY-NNNN` recipe, per-collection or per-tenant:

1. Event trigger: `items.create` on the collection, `type: "action"`, `async: true`.
2. SQL Query operation (`sql_1`): compute the next number — select the max serial for the prefix+year and increment (or a counter table / sequence).
3. Update Data operation: write <code v-pre>{{sql_1.rows.0.serial}}</code> back to <code v-pre>{{$trigger.keys[0]}}</code>, with `emitEvents: false`.

Creating records through raw SQL (for example from a [public endpoint](/guides/public-endpoints)) does **not** emit `items.create`, so serial flows are bypassed — compute the serial inside the INSERT itself, typically in a CTE, to avoid double-stamping.

## Webhook Triggers

Webhook-triggered flows are invoked with **GET** `/flows/trigger/{id}` — a POST returns `403` unless the flow's `options.method` is set to `"POST"`. The response body is whatever the flow's last operation returns. Set `options.error_on_reject: true` on chart/API flows so failures surface instead of rendering empty.

## The SQL Query Operation

`likha_sql` is a **custom operation** shipped with the platform — it appears in the flow editor alongside the built-in operations and is enumerable via `GET /extensions?limit=-1`. It runs raw SQL server-side — multi-statement is fine — and is the sanctioned way to change things the REST layer cannot: relation internals such as `junction_field` and `one_deselect_action`, foreign-key cascade rules, and bulk fixes.

Options: `{ "sql": "...", "binding": [] }`. It returns:

```json
{ "sql": "...", "binding": [], "rows": [ { "col": "value" } ] }
```

- In downstream **Update Data** payloads, reference rows as <code v-pre>{{sql_1.rows.0.col}}</code>.
- In **Run Script** operations, unwrap defensively: `const rows = data.sql_1.rows || data.sql_1`.
- `UPDATE`/`DELETE` statements return `rows: []` — there is no `RETURNING` unless you add one.
- Writing <code v-pre>{{sql_1.0.x}}</code> (without `.rows`) stores the literal string `"undefined"`.
- Interpolated values are **not** escaped — when building SQL from request input, run a validation Run Script first that strips or escapes quotes (`String(s).replace(/'/g, "''")`).

Run it from a webhook-triggered flow — the `manual` trigger is rejected over the API. After direct database changes, clear the system cache: `POST /utils/cache/clear` with `{"cache":"system"}`.

## Shell `$` Expansion Corrupts Flow Options

`python -c "... $trigger ..."` or `curl --data "... $last ..."` inside double quotes silently strips `$trigger`, `$last`, and `$full`, storing mutilated options (`data. || {}`, <code v-pre>{{.key}}</code>) — the flow then dies silently. Always create or patch operations containing `$` tokens **from a script file**, never an inline command, and verify the stored options afterward.

## Script Output Must Be JSON-Safe

A Run Script operation's return value must clone cleanly — **no functions**. An ECharts option containing `formatter: function(...)`, for example, fails with `could not be cloned`. Use string templates (`"{b}: {c}"`) instead of formatter functions.

## Email Operations Need SMTP

The Send Email operation only works when `EMAIL_*` environment variables are configured on the server; otherwise the flow appears to succeed while sending nothing.
