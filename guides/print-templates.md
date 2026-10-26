# Print Templates

Generate printable documents — certificates, forms, receipts — from collection data using Liquid templates.

## The `print` Field

A printable button is an alias field on the collection:

- `type: "alias"`, `special: ["alias", "no-data"]`
- `interface: "print"`
- Options:

```json
{
  "templateSelection": {
    "collection": "print_template",
    "key": "<template-row-uuid>"
  },
  "fields": ["*.*.*"]
}
```

`fields` controls how deep the item is resolved when handed to the template — `"*.*.*"` resolves relations three levels deep.

Templates themselves are rows in the `print_template` collection containing LiquidJS HTML. Keep a local copy of each template under source control; re-fetch template row UUIDs by name before writing them into field options (terminal output can clip long UUIDs).

## Template Context

The template's context is the item resolved to `fields` depth:

- **M2O fields** arrive as nested objects — <code v-pre>{{ order.customer.name }}</code>.
- **O2M fields** arrive as arrays — iterate directly:

```liquid
{% for line in order.lines %}
  {{ line.product.name }} — {{ line.qty }}
{% endfor %}
```

Verified filters and tags: `default`, `date`, `upcase`, `capitalize`, `replace`, `newline_to_br`, `{% case %}`.

## Letterheads via a Settings Singleton

To give every document a branded letterhead (org name, logo, address):

1. Add a `settings` M2O field on the printable collection pointing at your settings singleton.
2. Stamp it automatically with an `items.create` event flow whose Update Data operation writes <code v-pre>key: "{{$trigger.key}}"</code> with `emitEvents: false` and `permissions: "$full"`.
3. Backfill existing rows once.

Templates then read <code v-pre>{{ settings.org_name }}</code>, <code v-pre>{{ settings.address }}</code>, and so on. For multi-tenant deployments the "singleton" becomes one row per tenant — templates keep using `settings.*` unchanged.

## `csv` Fields Arrive as JSON Strings

A `csv` field reaches the template as the string `'["a","b"]'` — not an array. Iterate it with:

```liquid
{% assign tags = field | split: ',' %}
{% for t in tags %}
  {{ t | replace: '[', '' | replace: ']', '' | replace: '"', '' }}
{% endfor %}
```

The same caveat applies in SQL — see [`csv` fields in SQL](/guides/dashboards-panels#csv-fields-in-sql).

## Multiple Print Fields Per Collection

Several `print` alias fields can coexist on one collection — for example `print`, `print_settlement`, `print_certificate` — each pointing at a different `print_template` row.

## QR Verification Codes

Embed a QR that resolves to your public verification page (see [Public Endpoints & Portals](/guides/public-endpoints)):

```liquid
<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ verify_url }}"
     width="120" height="120" />
```

Point `verify_url` at your portal — for example <code v-pre>https://your-portal.com/verify/{{ serial }}</code>. A printed document then self-verifies when scanned.
