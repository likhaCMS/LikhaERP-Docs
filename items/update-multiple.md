# Update Multiple Items

Update multiple items at once.

**Endpoint:** `PATCH /items/{collection}`

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
| `offset` | integer | Number of items to skip |
| `sort` | array | CSV of fields to sort by |
| `filter` | object | Filter items by conditions |
| `search` | string | Filter items containing the search query |
| `meta` | string | Specify what metadata to return |

## Request Body

```json
{
  "data": {
    "keys": [1, 2, 3],
    "status": "published",
    "updated_by": 5
  }
}
```

The `data` object must contain:
- `keys` (array): Array of item IDs to update
- Any other fields: These will be merged into each specified item

## Responses

### 200 OK

Items updated successfully. Returns the updated items:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Original Title",
      "status": "published",
      "updated_by": 5,
      ...
    },
    {
      "id": 2,
      "title": "Another Title",
      "status": "published",
      "updated_by": 5,
      ...
    },
    {
      "id": 3,
      "title": "Third Title",
      "status": "published",
      "updated_by": 5,
      ...
    }
  ],
  "meta": {}
}
```

### 401 Unauthorized

Authentication required.

### 404 Not Found

The specified collection does not exist.

## Example Request

```http
PATCH /api/items/articles HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "data": {
    "keys": [1, 2, 3],
    "status": "published"
  }
}
```

## Notes

- The `keys` array is required to identify which items to update
- All fields in the `data` object (except `keys`) will be applied to every item
- This is a partial update - only provided fields will be modified
- To update items based on a query filter, use the query parameter approach
- The operation is atomic - either all items are updated or none
- Use the `fields` query parameter to control which fields are returned in the response
- Consider rate limits when updating large numbers of items
- System fields (like `date_created`) may not be updatable depending on configuration