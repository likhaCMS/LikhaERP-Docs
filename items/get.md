# Retrieve Item

Retrieve a specific item by its unique ID.

**Endpoint:** `GET /items/{collection}/{id}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collection` | string | Yes | Unique identifier of the collection |
| `id` | string/integer | Yes | Unique identifier of the item |

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| `version` | string | Retrieve from a specific content version |
| `fields` | array | Control which fields are returned in the response |
| `meta` | string | What metadata to return |

## Responses

### 200 OK

Item retrieved successfully:

```json
{
  "data": {
    "id": 1,
    "title": "Article Title",
    "content": "Article content...",
    "status": "published",
    "author_id": 1,
    "date_created": "2024-01-15T10:30:00Z",
    "date_updated": "2024-01-16T14:20:00Z"
  }
}
```

### 401 Unauthorized

Authentication required.

### 404 Not Found

The specified collection or item does not exist.

## Example Request

```http
GET /api/items/articles/1?fields=id,title,content,status HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Notes

- The `id` can be a numeric ID or a UUID depending on your collection configuration
- Use the `fields` parameter to optimize response size by requesting only needed fields
- If the item doesn't exist or the ID is invalid, a 404 is returned
- The `version` parameter is useful when content versioning is enabled
- System fields like `date_created`, `user_created`, etc. are included by default unless filtered out
- For relational fields, you can use dot notation to access nested data (e.g., `author.name`)
- Consider caching frequently accessed items to reduce database load
- The item's visibility respects the collection's permission settings
