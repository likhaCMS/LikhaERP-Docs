# Platform Guides

Practical, battle-tested recipes for building applications on the Likha ERP platform. These guides go beyond the reference docs — they capture the patterns, gotchas, and conventions that come from running real production apps on Likha ERP.

## Guides

- [API Notes & Best Practices](/guides/api-notes) — request-layer details that save you hours: user agents, URL encoding, status-code quirks, and async write behavior.
- [Data Modeling Recipes](/guides/data-modeling) — collections, relations, junctions, tab layouts, singletons, and geometry fields.
- [Permissions & Multi-Tenancy](/guides/permissions-tenancy) — roles, policies, permission presets, tenant isolation, and append-only collections.
- [Automation Recipes](/guides/automation-recipes) — flows, operations, webhook triggers, serial numbering, and the SQL Query operation.
- [Dashboards & Panels](/guides/dashboards-panels) — metric, chart, heatmap, and custom panel types with their exact option shapes.
- [Print Templates](/guides/print-templates) — printable documents with Liquid templates, letterheads, and QR codes.
- [Public Endpoints & Portals](/guides/public-endpoints) — public webhook flows, customer-facing tracking pages, and verification links.

## Conventions Used in These Guides

- `https://your-domain.com` — replace with your project URL.
- `YOUR_ACCESS_TOKEN` — an admin or role access token. Keep it in an environment variable (for example `LIKHA_TOKEN`) and never commit it.
- `app_` — a stand-in for your application's collection prefix. On shared instances, every artifact your app creates (collections, junctions, flows, roles, policies) should carry a consistent prefix so it never collides with other apps.
- System collections are referenced throughout as `system_users`, `system_files`, `system_relations`, `system_flows`, and so on.
