# Data Modeling Recipes

Patterns for structuring collections, relationships, and layouts that are known to work cleanly over the API.

## Collection Folders

A folder is a collection with `schema: null`. Create it once, then file collections into it by setting `meta.group` on each:

```bash
# PATCH /collections/{name}
{ "meta": { "group": "MyApp" } }
```

Folders keep the navigation sidebar manageable on instances with many collections.

## Audit Fields Are Not Automatic

Setting `meta.accountability: "all"` on a collection does **not** create `user_created`, `date_created`, `user_updated`, or `date_updated` — the meta flag says `all` while zero fields exist. Create them explicitly:

1. Four fields: `user_created` (uuid, special `user-created`), `date_created` (timestamp, special `date-created`), `user_updated` (uuid, special `user-updated`), `date_updated` (timestamp, special `date-updated`). Mark each `readonly` + `hidden`.
2. Then POST the two M2O relations — `user_created` and `user_updated` — to the `system_users` collection.

Skip step 2 and the fields store a UUID they cannot resolve, surfacing as a "relationship not configured" error in the app.

## Reverse O2M Aliases

A reverse one-to-many alias field is created automatically by setting `meta.one_field` on the relation POST. Then PATCH `/fields/{collection}/{alias}` to set:

- `interface: list-o2m`
- `options.template` — the display template for each row
- `meta.group` — which tab group the field lands in

## Many-to-Many Junctions

M2M needs `junction_field` set on the junction→parent relation **on both sides**, plus patching the alias field to `interface: list-m2m` (or `files` for file galleries). A missing second side produces "relationship not configured" in the app.

If the relation was created without `junction_field` on both sides, fix it with the [SQL Query operation](/guides/automation-recipes#the-sql-query-operation) rather than trying to PATCH the relation — then [clear the schema cache](/guides/api-notes#prefer-recreating-relations-over-updating-them).

### Prefer O2M Junctions When You Need Per-Link Data

When each link needs its own fields (a role, a statement, a charged price), model the "junction" as a regular collection with two M2O relations and edit it through the parent's `list-o2m` alias. You get inline editing, and the `junction_field` problem disappears entirely.

### Junction Keys Must Stay Visible

Do not set `hidden: true` on the FK fields of a junction (the parent key, the related key, or the `system_files` key). Hiding them breaks `list-m2m` and `files` interfaces with "relationship not configured".

### Cascading Deletes

`one_deselect_action` can't be changed reliably after creation. Either delete junction rows before deleting the parent, or enforce it at the database level:

```sql
ALTER TABLE app_work_orders_files
  DROP CONSTRAINT app_work_orders_files_work_order_foreign,
  ADD CONSTRAINT app_work_orders_files_work_order_foreign
  FOREIGN KEY (work_order) REFERENCES app_work_orders(id) ON DELETE CASCADE;
```

Then update the relations registry so the app knows the link deletes children (`one_deselect_action = 'delete'` on the junction's parent field), and clear the schema cache.

## Tab Layouts (Group Fields)

Tabbed item pages are built from group fields, no extensions required:

- Each tab is a field of `type: alias` with `special: ["alias", "group", "no-data"]` — for example `grp_tabs`.
- Child fields point at their tab via `meta.group`.
- Set `meta.translations` on the group field for tab labels.

This scales to deep layouts — five- and seven-tab detail pages are routine.

## Singletons

A singleton collection rejects `POST /items/{collection}` with `ROUTE_NOT_FOUND` — the row already exists. Use PATCH instead.

## list-o2m Display Options

`options.fields: ["a", "b"]` renders junction rows as real table columns, not just a template string. Useful companions: `options.sortField`, `enableLink`, `enableCreate`, `enableSelect`, `enableSearchFilter`.

To hide a pure junction collection from the navigation while keeping it editable through its parent, set `meta.hidden: true` on the collection.

## M2O Pickers Need a Template

Without `options.template`, a many-to-one dropdown renders raw UUIDs. Always set a display template.

## Geometry Fields

Field types are namespace-prefixed: `type: "point"` is rejected — use `geometry.Point`, `geometry.MultiPolygon`, or plain `geometry`. Payloads accept and return GeoJSON objects:

```json
{ "type": "Point", "coordinates": [120.9842, 14.5995] }
```

Remember: **longitude first**, then latitude.

Map interface options:

```json
{
  "basemap": "OpenStreetMap",
  "defaultView": { "center": { "lat": 14.5995, "lng": 120.9842 }, "zoom": 13 }
}
```

OpenStreetMap needs no API token.
