# Create Item

Create a single item in a collection.

**Endpoint:** `POST /items/{collection}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collection` | string | Yes | Unique identifier of the collection |

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| `fields` | array | Control which fields are returned in the response |
| `meta` | string | Specify what metadata to return |

## Request Body

```json
{
  "title": "New Article Title",
  "content": "This is the article content...",
  "status": "draft",
  "author_id": 1,
  "tags": ["news", "updates"]
}
```

Provide a single item object with the fields for the new record.

## Responses

### 200 OK

Item created successfully. Returns the created item with its generated ID:

```json
{
  "data": {
    "id": 1,
    "title": "New Article Title",
    "content": "This is the article content...",
    "status": "draft",
    "author_id": 1,
    "tags": ["news", "updates"],
    "date_created": "2024-01-15T10:30:00Z"
  }
}
```

### 401 Unauthorized

Authentication required.

### 404 Not Found

The specified collection does not exist.

## Example Request

```http
POST /api/items/articles HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "New Article",
  "content": "Article content...",
  "status": "draft"
}
```

## Notes

- All required fields defined in the collection schema must be provided
- Auto-increment IDs are generated automatically upon creation
- System fields like `date_created`, `user_created` are populated automatically
- Use the `fields` query parameter to limit which fields are returned in the response
- The request body should be a single object, not an array (use `createItems` for bulk creation)
- Validation errors will return a 400 Bad Request with details about the validation failure
- Consider using transactions if you need to create multiple related items across different collections
