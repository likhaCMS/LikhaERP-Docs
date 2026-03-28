# Reset Password

Reset a user's password using a one-time token from the password reset email.

**Endpoint:** `POST /auth/password/reset`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | One-time use JWT token from the reset email |
| `password` | string | Yes | New password for the user |

## Responses

### 204 No Content

Password reset successful. No response body.

### 401 Unauthorized

Invalid or expired reset token.

### 404 Not Found

User not found or token invalid.

## Example Request

```http
POST /auth/password/reset HTTP/1.1
Host: your-domain.com
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newSecurePassword123!"
}
```

## Notes

- The `token` is a JWT that is sent to the user's email when they request a password reset
- The token is one-time use and has an expiration time (typically 1 hour)
- The new password must meet the system's password requirements (minimum length, complexity, etc.)
- After successful reset, the user can log in with the new password
- The reset link in the email typically points to the admin app, which then calls this endpoint
- For security, always use HTTPS when submitting passwords
- Consider implementing rate limiting on this endpoint to prevent abuse
- The response is 204 No Content on success, so check for errors rather than expecting a success message
- If the token is invalid or expired, the user will need to request a new password reset email