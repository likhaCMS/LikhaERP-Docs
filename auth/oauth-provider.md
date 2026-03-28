# Login Using OAuth Provider

Start the OAuth flow using a specified provider.

**Endpoint:** `GET /auth/oauth/{provider}`

## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `provider` | string | Yes | Key of the activated OAuth provider (e.g., 'github', 'google') |

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `redirect` | string | No | URL to redirect to on successful login. If omitted, authentication details are returned in JSON |

## Responses

### 200 OK

If `redirect` is not provided, returns authentication details in JSON:

```json
{
  "data": {
    "token": "eyJhbGciOiJI..."
  }
}
```

If `redirect` is provided, the user is redirected to the specified URL with authentication details (typically in cookies or URL parameters depending on configuration).

### 401 Unauthorized

The specified OAuth provider is not configured or is disabled.

## Example Request

### Using Browser/Redirect

```http
GET /auth/oauth/github?redirect=https://myapp.com/callback HTTP/1.1
Host: your-domain.com
```

This redirects the user to GitHub for authorization, then back to the redirect URL.

### Using Raw HTTP (no redirect)

```http
GET /auth/oauth/github HTTP/1.1
Host: your-domain.com
```

Response:

```json
{
  "data": {
    "token": "eyJhbGciOiJI..."
  }
}
```

## Notes

- The `provider` parameter must match one of the configured OAuth provider keys (check `/auth/oauth` for the list)
- OAuth providers must be configured in the admin panel with proper client IDs and secrets
- The `redirect` parameter is useful for web applications that need to handle the OAuth callback
- If no `redirect` is provided, the authentication token is returned directly in the JSON response
- The returned `token` can be used as a bearer token in subsequent API requests
- OAuth flow typically involves:
  1. User is redirected to provider (GitHub, Google, etc.)
  2. User authorizes the application
  3. Provider redirects back to your app
  4. This endpoint exchanges the OAuth code for an access token
- For security, always use HTTPS in production when using OAuth
- The exact behavior may vary depending on your OAuth provider configuration