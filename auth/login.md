# Login

Authenticate as a user to obtain access tokens.

**Endpoint:** `POST /auth/login`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address of the user |
| `password` | string | Yes | User's password |
| `mode` | string | No | How to receive the refresh token: `json` or `cookie` |
| `otp` | string | Conditional | One-time password if MFA is enabled |

## Responses

### 200 OK

Authentication successful. Returns access token and refresh token:

```json
{
  "data": {
    "access_token": "eyJhbGciOiJI...",
    "expires": 900,
    "refresh_token": "yuOJkjdPXMd..."
  }
}
```

- `access_token`: JWT token for API requests (expires in `expires` seconds)
- `refresh_token`: Token to obtain new access tokens without re-login
- `expires`: Access token lifetime in seconds

### 401 Unauthorized

Invalid credentials or user is disabled.

### 404 Not Found

User with the provided email does not exist.

## Example Request

```http
POST /auth/login HTTP/1.1
Host: your-domain.com
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Notes

- The `mode` parameter controls how the refresh token is returned:
  - `json` (default): Refresh token in response body
  - `cookie`: Refresh token in httpOnly cookie (more secure for web apps)
- If the user has Multi-Factor Authentication (MFA) enabled, you must provide the `otp` parameter
- Access tokens should be included in subsequent API requests: `Authorization: Bearer <token>`
- The `expires` value indicates how long the access token is valid (in seconds)
- Use the refresh token to obtain new access tokens without requiring the user to log in again
- Store tokens securely and never expose them in client-side code
- Consider using environment variables or secure storage for tokens in production