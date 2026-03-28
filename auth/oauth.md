# List Auth Providers

List all configured OAuth authentication providers.

**Endpoint:** `GET /auth/oauth`

## Responses

### 200 OK

Returns an array of provider names:

```json
{
  "data": [
    "github",
    "facebook",
    "google"
  ]
}
```

### 401 Unauthorized

Authentication required (if the endpoint is protected).

## Example Request

```http
GET /auth/oauth HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Notes

- This endpoint returns the keys of all configured OAuth providers
- The available providers are configured in the admin panel under Authentication > OAuth
- Each provider must be properly configured with client ID, secret, and other settings
- To initiate OAuth login, use the `/auth/oauth/{provider}` endpoint with the provider key from this list
- The response is a simple array of strings, each representing a provider name
- This endpoint can be used to dynamically build OAuth login buttons based on available providers
