# List Items

Retrieve a list of items from a collection.

**Endpoint:** `GET /items/{collection}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collection` | string | Yes | Unique identifier of the collection |

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| `fields` | array | Control which fields are returned in the response |
| `limit` | integer | Limit the number of objects returned |
| `offset` | integer | Number of items to skip when fetching data |
| `sort` | array | CSV of fields to sort by (use `-` prefix for descending order) |
| `filter` | object | Filter items by given conditions |
| `search` | string | Filter items containing the search query in any field |
| `meta` | string | Specify what metadata to return |
| `backlink` | boolean | Retrieve relational items excluding reverse relations when using wildcard fields |

## Responses

### 200 OK

Successful request returns an array of items:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Item 1",
      ...
    }
  ],
  "meta": {
    "total_count": 100,
    "limit": 10,
    "offset": 0
  }
}
```

### 401 Unauthorized

Authentication required. Include a valid access token in the `Authorization` header.

### 404 Not Found

The specified collection does not exist.

## Example Request

```http
GET /api/items/articles?fields=id,title,status&limit=20&sort=-date_created&filter={"status":"published"} HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Notes

- Sorting defaults to ascending (ASC). Prefix field names with `-` for descending (DESC)
- The `filter` parameter supports various operators like `_eq`, `_contains`, `_gt`, etc.
- Use the `fields` parameter to optimize response size by requesting only needed fields
- Pagination metadata is included in the `meta` object when applicable
- The `backlink` parameter is useful when using wildcard fields (`*`) to avoid circular references