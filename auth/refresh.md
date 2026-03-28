# Refresh Token

Obtain a new access token using a refresh token.

**Endpoint:** `POST /auth/refresh`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refresh_token` | string | Yes | Valid refresh token (not expired) |
| `mode` | string | No | How to receive the new refresh token: `json` or `cookie` |

## Responses

### 200 OK

Returns new access token and optionally a new refresh token:

```json
{
  "data": {
    "access_token": "eyJhbGciOiJI...",
    "expires": 900,
    "refresh_token": "Gy-caJMpmGTA..."
  }
}
```

- `access_token`: New JWT access token
- `expires`: Access token lifetime in seconds
- `refresh_token`: New refresh token (may be rotated)

### 401 Unauthorized

Invalid, expired, or revoked refresh token.

## Example Request

```http

```http
POST /auth/refresh HTTP/1.1
Host: your-domain.com
Content-Type: application/json

{
  "refresh_token": "yuOJkjdPXMd..."
}
```

## Notes

- Refresh tokens have a longer lifetime than access tokens (typically days or weeks)
- Use this endpoint when the access token expires to maintain the user's session without requiring re-login
- Some systems rotate refresh tokens on each use for enhanced security (you'll receive a new refresh token)
- The `mode` parameter works the same as in `/auth/login`:
  - `json`: Refresh token in response body
  - `cookie`: Refresh token in httpOnly cookie
- Store refresh tokens securely (httpOnly cookies or secure server-side storage)
- Never expose refresh tokens in client-side JavaScript or public repositories
- If a refresh token is compromised, it should be revoked using the `/auth/logout` endpoint
- The `expires` field indicates how long the new access token is valid
- Consider implementing automatic token refresh in your application to handle token expiration seamlessly