# Authentication

Learn about the three authentication modes for WebSocket connections in Likha ERP Realtime.

## Authentication Modes

There are three authentication modes for WebSocket connections:

| Mode | Description |
|------|-------------|
| **`public`** | No authentication required. Limited to public role permissions. |
| **`handshake`** | No authentication to connect. First message must be an authentication request sent before the timeout. |
| **`strict`** | Authentication required as a URL parameter on the initial connection. |

`handshake` is the default authentication mode.

### Changing Authentication Modes

You can only use one authentication mode at a time. When self-hosting, set the `WEBSOCKETS_REST_AUTH`, `WEBSOCKETS_GRAPHQL_AUTH` and `WEBSOCKETS_LOGS_AUTH` environment variables to one of these modes. By default, they are set to `handshake`.

## Public Mode

### WebSocket

No authentication is required, but connections are limited to the public role permissions. To change roles, use the handshake authentication flow.

### GraphQL

```js
import { createClient } from "graphql-ws";

const client = createClient({
	url: "ws://your-likha-erp-url/graphql",
	keepAlive: 30000,
});
```

## Handshake Mode

### WebSocket

Your first message must include authentication details and be sent before the timeout. Three authentication options are available:

**Access Token**

```json
{
	"type": "auth",
	"access_token": "your-access-token"
}
```

**Email and Password**

```json
{
	"type": "auth",
	"email": "user@email.com",
	"password": "your-password"
}
```

**Refresh Token**

```json
{
	"type": "auth",
	"refresh_token": "token"
}
```

On successful authentication, you'll receive a confirmation message. When using email/password or refresh token credentials, this message includes a `refresh_token`:

```json
{
	"type": "auth",
	"status": "ok",
	"refresh_token": "a-token-to-use-later"
}
```

When the client receives an auth expired error, a new authentication request is expected within the set timeout or the connection will be closed.

### GraphQL

```js
import { createClient } from "graphql-ws";

const client = createClient({
	url: "ws://your-likha-erp-url/graphql",
	keepAlive: 30000,
	connectionParams: async () => {
		return { access_token: "MY_TOKEN" };
	},
});
```

## Strict Mode

### WebSocket

When initially opening your connection, add an `access_token` query parameter to your request:

```
ws://your-likha-erp-url/websockets?access_token=your-access-token
```

Once initially authenticated, all three authentication methods are available.

### GraphQL

```js
import { createClient } from "graphql-ws";

const client = createClient({
	url: "ws://your-likha-erp-url/graphql?access_token=your-access-token",
	keepAlive: 30000,
});
```

When a token expires, the connection will be closed with a `Forbidden` message, signaling to the client to refresh their `access_token` and reconnect.
