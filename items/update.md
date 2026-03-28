# Update Item

Update an existing item by its ID.

**Endpoint:** `PATCH /items/{collection}/{id}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collection` | string | Yes | Unique identifier of the collection |
| `id` | string/integer | Yes | Unique identifier of the item to update |

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| `fields` | array | Control which fields are returned in the response |
| `meta` | string | What metadata to return |

## Request Body

```json
{
  "title": "Updated Article Title",
  "content": "Updated article content...",
  "status": "published"
}
```

Provide a partial object containing only the fields you want to update.

## Responses

### 200 OK

Item updated successfully. Returns the updated item:

```json
{
  "data": {
    "id": 1,
    "title": "Updated Article Title",
    "content": "Updated article content...",
    "status": "published",
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
PATCH /items/articles/1 HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "published",
  "published_date": "2024-01-16T14:20:00Z"
}
```

## Notes

- This is a **partial update** - only include fields you want to change
- Unprovided fields remain unchanged
- System fields like `date_created` cannot be updated
- The `date_updated` field is automatically updated on modification
- Use the `fields` query parameter to control which fields are returned
- Validation rules defined in the collection schema still apply
- For bulk updates, use the `updateItems` endpoint for better performance
- The item's ID cannot be changed
- Consider using transactions if you need to update multiple related items atomically
- Check permissions - users can only update items they have edit access to
