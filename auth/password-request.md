# Request Password Reset

Request a password reset email to be sent to the given user.

**Endpoint:** `POST /auth/password/request`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address of the user requesting a reset |
| `reset_url` | string | No | Custom reset URL. Requires `PASSWORD_RESET_URL_ALLOW_LIST` to be configured |

## Responses

### 204 No Content

Password reset email queued successfully. No response body.

### 401 Unauthorized

Authentication required (if the endpoint is protected).

### 404 Not Found

No user exists with the provided email address.

## Example Request

```http
POST /auth/password/request HTTP/1.1
Host: your-domain.com
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## Notes

- A password reset email will be sent to the user with a one-time use reset link
- The reset link contains a JWT token that is valid for a limited time
- For security, the response is always 204 even if the email doesn't exist (to prevent email enumeration)
- The `reset_url` parameter allows you to specify a custom URL for the reset link:
  - The reset token will be appended as a query parameter
  - The URL must be whitelisted in the `PASSWORD_RESET_URL_ALLOW_LIST` environment variable
  - This is useful for custom password reset flows or mobile apps
- Ensure your email service is properly configured for password reset emails to be sent
- The email template can be customized in the admin panel under Templates
- Users should be instructed to check their spam folder if they don't receive the email