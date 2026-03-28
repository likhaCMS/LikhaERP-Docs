# Likha ERP API Documentation

Welcome to the Likha ERP API documentation. This guide covers all available endpoints for interacting with your Likha ERP instance.

## Getting Started

- [Configure Data Model](data-model-setup.md) - Create collections, fields, and relationships
- [API Quickstart](api-quickstart.md) - Make your first API requests
- [Authentication Quickstart](auth-quickstart.md) - Register, login, and make authenticated requests
- [Realtime Quickstart](realtime-quickstart.md) - Connect to realtime data with WebSockets
- [Automation Quickstart](automation-quickstart.md) - Create your first flow

## Table of Contents

### Core Concepts
- [Query Parameters](query-parameters.md) - Complete guide to all query parameters
- [Filter Rules](filters.md) - Filter syntax, operators, and advanced features

### Authentication API
- [Login](auth/login.md) - Authenticate as a user
- [Logout](auth/logout.md) - Invalidate refresh token and end session
- [List OAuth Providers](auth/oauth.md) - Get configured OAuth providers
- [OAuth Login](auth/oauth-provider.md) - Start OAuth flow with provider
- [Request Password Reset](auth/password-request.md) - Send password reset email
- [Reset Password](auth/password-reset.md) - Set new password with token
- [Refresh Token](auth/refresh.md) - Get new access token

### Items API
- [List Items](items/list.md) - Retrieve multiple items from a collection
- [Create Multiple Items](items/create-multiple.md) - Create multiple items in bulk
- [Delete Multiple Items](items/delete-multiple.md) - Delete multiple items at once
- [Update Multiple Items](items/update-multiple.md) - Update multiple items in bulk
- [Create Item](items/create.md) - Create a single item
- [Singleton Operations](items/singleton.md) - Retrieve and update singleton items
- [Retrieve Item](items/get.md) - Get a specific item by ID
- [Delete Item](items/delete.md) - Delete a specific item
- [Update Item](items/update.md) - Update a specific item

### Files API
- [Files](files/) - Upload, access, and transform files

### Automation API
- [Flows](automation/flows.md) - Event-driven data processing and task automation
- [Triggers](automation/triggers.md) - Events and conditions that start flows
- [Operations](automation/operations.md) - Individual actions within a flow
- [Data Chain](automation/data-chain.md) - Understanding data flow between operations

### Realtime API
- [Realtime](realtime/) - WebSocket and GraphQL subscriptions for live data updates

## Base URL

All API requests should be made to:

```
https://your-domain.com/api
```

## Authentication

All API endpoints require authentication. Include your access token in the request headers:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Query Parameters

Many endpoints support the following query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `fields` | array | Control which fields are returned in the response |
| `limit` | integer | Limit the number of objects returned |
| `offset` | integer | Skip a number of items when fetching data |
| `sort` | array | Sort results by specified fields (use `-` prefix for descending) |
| `filter` | object | Filter items by given conditions - see [Filter Rules](filters.md) for complete syntax |
| `search` | string | Filter items containing the search query in any field |
| `meta` | string | Specify what metadata to return in the response |
| `backlink` | boolean | Retrieve relational items excluding reverse relations with wildcard fields |

## Response Format

All successful responses follow this structure:

```json
{
  "data": {},
  "meta": {}
}
```

The `meta` object contains pagination and total count information when applicable.

---

## Quick Start

### Basic CRUD Operations (REST API)

All API requests are made using standard HTTP methods and JSON.

**List items:**

```http
GET /api/items/articles?limit=10 HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Create item:**

```http
POST /api/items/articles HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "New Article"
}
```

**Get single item:**

```http
GET /api/items/articles/1 HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Update item:**

```http
PATCH /api/items/articles/1 HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "published"
}
```

**Delete item:**

```http
DELETE /api/items/articles/1 HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

For detailed documentation on each endpoint, click the links in the Table of Contents above.