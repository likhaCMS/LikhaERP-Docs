# Permissions & Multi-Tenancy

Role and policy patterns for real applications: scoped data access, tenant isolation, and record immutability.

## Roles and Policies

Each application role pairs with an identically-named access policy — for example `app_staff` and `app_staff_policy`. Create the role, link the policy through access entries, then add permission rows for each action (`create`, `read`, `update`, `delete`) on each collection the role may touch.

## `$CURRENT_USER` Belongs in Presets, Not Defaults

`$CURRENT_USER` is **not** a valid `schema.default_value` — it fails with `500 invalid uuid`. To default a field to the logged-in user, use a permission **preset** on the role's create permission:

```json
{
  "collection": "app_tasks",
  "action": "create",
  "presets": { "created_by": "$CURRENT_USER" }
}
```

Deep paths work in both presets and filters: `$CURRENT_USER.app_store` resolves to the related item, not just the raw key.

## Multi-Tenancy Pattern

The standard recipe for tenant-scoped apps (branches, sites, organizations):

1. **Tenant root collection** — `app_tenants`, one row per tenant.
2. **`tenant` M2O on every tenant-owned collection** — plus on the `system_users` collection, so each staff user is assigned to a tenant.
3. **Role permission filters** — staff roles read and write through:

```json
{ "tenant": { "_eq": "$CURRENT_USER.tenant" } }
```

For child collections, filter through the parent (`{ "work_order": { "tenant": { "_eq": "$CURRENT_USER.tenant" } } }`); for junctions, filter through the junction's parent key.

4. **Create presets** — staff creates get `{ "tenant": "$CURRENT_USER.tenant" }` so rows are stamped with the creator's tenant automatically.
5. **An unfiltered admin role** — a manager/admin tier sees all tenants by omitting the filter entirely.

Serial numbers can embed a tenant code for per-tenant, per-year counters — for example `DOC-SITE1-2026-0001`. See [Automation Recipes](/guides/automation-recipes#serial-numbering) for the stamping flow.

## Append-Only Collections

For audit trails and activity feeds — anything staff may add to but never rewrite:

- Remove `update` and `delete` permissions for staff roles; keep all actions for managers.
- Make `created_by` `readonly` on the field and preset it to `$CURRENT_USER`.
- Make system-stamped fields (like `notification_sent_at`) `readonly`; a blank value conveniently means "pending".
