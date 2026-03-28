# Create Multiple Items

Create new items in bulk within a collection.

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
| `limit` | integer | Limit the number of objects returned |
| `offset` | integer | Number of items to skip |
| `sort` | array | CSV of fields to sort by |
| `filter` | object | Filter items by conditions |
| `search` | string | Filter items containing the search query |
| `meta` | string | Specify what metadata to return |

## Request Body

```json
{
  "data": [
    {
      "field1": "value1",
      "field2": "value2"
    },
    {
      "field1": "value3",
      "field2": "value4"
    }
  ]
}
```

The `data` array contains one or more item objects to create.

## Responses

### 200 OK

Items created successfully. Returns the created items with their generated IDs:

```json
{
  "data": [
    {
      "id": 1,
      "field1": "value1",
      "field2": "value2"
    },
    {
      "id": 2,
      "field1": "value3",
      "field2": "value4"
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
POST /items/articles HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "data": [
    {
      "title": "New Article 1",
      "content": "Content..."
    },
    {
      "title": "New Article 2",
      "content": "Content..."
    }
  ]
}
```

## Notes

- All required fields must be provided for each item
- The response includes the newly created items with their auto-generated IDs
- If any item fails validation, the entire request may fail (transactional behavior)
- Use the `fields` query parameter to control which fields are returned in the response
- Consider using batch creation for large datasets to avoid timeouts
