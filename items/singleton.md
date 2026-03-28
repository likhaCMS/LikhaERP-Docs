# Singleton Operations

Singletons are special collections that contain exactly one item. They are useful for storing site-wide settings or single-instance data.

## Retrieve Singleton

Retrieve the singleton item from a collection.

**Endpoint:** `GET /items/{collection}/singleton`

### Parameters

**Path Parameters:**
- `collection` (string, required) - Collection name

**Query Parameters:**
- `version` (string) - Retrieve from a specific content version
- `fields` (array) - Control which fields are returned
- `meta` (string) - What metadata to return

### Responses

**200 OK** - Singleton retrieved successfully

```json
{
  "data": {
    "id": 1,
    "site_name": "My Website",
    "maintenance_mode": false,
    ...
  }
}
```

**401 Unauthorized**

**404 Not Found** - Collection or singleton doesn't exist

### Example Request

```http
GET /api/items/site_settings/singleton HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Update Singleton

Update the singleton item.

**Endpoint:** `PATCH /items/{collection}/singleton`

### Parameters

**Path Parameters:**
- `collection` (string, required) - Collection name

**Query Parameters:**
- `fields` (array) - Control which fields are returned
- `meta` (string) - What metadata to return

### Request Body

```json
{
  "site_name": "Updated Site Name",
  "maintenance_mode": true,
  "logo_id": 5
}
```

### Responses

**200 OK** - Singleton updated successfully

```json
{
  "data": {
    "id": 1,
    "site_name": "Updated Site Name",
    "maintenance_mode": true,
    "logo_id": 5,
    ...
  }
}
```

**401 Unauthorized**

**404 Not Found**

### Example Request

```http
PATCH /api/items/site_settings/singleton HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "maintenance_mode": true,
  "announcement": "Scheduled maintenance tonight"
}
```

---

## Notes

- A singleton collection should have exactly one item. The system enforces this constraint.
- The singleton endpoints behave similarly to regular item endpoints but don't require an ID
- Use singletons for configuration data, site settings, or any data that should have a single record
- The `version` parameter allows retrieving historical versions if content versioning is enabled
- Unlike regular items, singleton operations don't support bulk operations
- The singleton item can still be retrieved, updated, and deleted using regular item endpoints if you know the ID
- Consider caching singleton data as it's typically accessed frequently and rarely changes
