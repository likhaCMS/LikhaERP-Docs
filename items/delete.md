# Delete Item

Delete a specific item by its ID.

**Endpoint:** `DELETE /items/{collection}/{id}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collection` | string | Yes | Unique identifier of the collection |
| `id` | string/integer | Yes | Unique identifier of the item to delete |

## Responses

### 204 No Content

Successfully deleted. No response body is returned.

### 401 Unauthorized

Authentication required.

### 404 Not Found

The specified collection or item does not exist.

## Example Request

```http
DELETE /api/items/articles/1 HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Notes

- **Warning:** Deletion is permanent and cannot be undone
- The item is completely removed from the database
- Related data may also be affected depending on cascade delete settings
- Consider implementing a "soft delete" pattern by adding an `is_deleted` field instead
- Before deleting, consider if the data might be needed for audit purposes
- Check for foreign key constraints that might prevent deletion
- If you need to delete multiple items, use the bulk delete endpoint for better performance
- Always verify the correct ID before deletion, especially in production environments
- Some collections may have deletion restrictions based on user permissions