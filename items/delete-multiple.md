# Delete Multiple Items

Delete multiple items at the same time.

**Endpoint:** `DELETE /items/{collection}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collection` | string | Yes | Unique identifier of the collection |

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| `fields` | array | Control which fields are returned |
| `limit` | integer | Limit the number of objects returned |
| `offset` | integer | Number of items to skip |
| `sort` | array | CSV of fields to sort by |
| `filter` | object | Filter items by conditions |
| `search` | string | Filter items containing the search query |
| `meta` | string | Specify what metadata to return |

## Request Body

The request body must specify which items to delete. Provide **either** an array of IDs **or** a query object:

### Option 1: Array of IDs

```json
[1, 2, 3, 4, 5]
```

### Option 2: Object with `keys`

```json
{
  "keys": [1, 2, 3, 4, 5]
}
```

### Option 3: Object with `query`

```json
{
  "query": {
    "filter": {
      "status": "draft"
    }
  }
}
```

The `query` option allows you to delete items matching specific criteria.

## Responses

### 204 No Content

Successfully deleted. No response body is returned.

### 401 Unauthorized

Authentication required.

### 404 Not Found

The specified collection does not exist.

## Example Request

```http
DELETE /api/items/articles HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

[1, 2, 3]
```

or

```http
DELETE /api/items/articles?filter={"status":"draft"} HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Notes

- **Warning:** Deletion is permanent and cannot be undone
- The `query` option respects the same filter syntax as the read endpoints
- Consider using a "soft delete" pattern by adding an `is_deleted` field instead of actual deletion if data recovery might be needed
- When using the query method, be very specific with filters to avoid accidentally deleting too many items
- The `fields`, `limit`, `offset`, `sort`, `filter`, and `search` query parameters can also be used to refine which items are deleted when using the query object approach
- Always test deletion queries on a non-production environment first
