# Logout

Invalidate the refresh token, destroying the user's session.

**Endpoint:** `POST /auth/logout`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refresh_token` | string | Conditional | The refresh token to invalidate. Required if not using cookie mode |
| `mode` | string | No | How the refresh token was submitted: `json` or `cookie` |

## Responses

### 204 No Content

Successfully logged out. No response body returned.

### 401 Unauthorized

Invalid refresh token or already logged out.

### 404 Not Found

User session not found.

## Example Request

```http
POST /auth/logout HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "refresh_token": "yuOJkjdPXMd..."
}
```

## Notes

- If you used `mode: 'cookie'` when logging in, the refresh token is stored in an httpOnly cookie and you don't need to provide it in the request body
- Logout invalidates the refresh token, preventing it from being used to obtain new access tokens
- The current access token remains valid until it expires; you should discard it client-side
- After logout, the user will need to log in again to obtain new tokens
- It's a good practice to clear any stored tokens from your application state
- For security, consider implementing token blacklisting on the server side