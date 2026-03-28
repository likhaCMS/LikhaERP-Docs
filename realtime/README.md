# Realtime API

Learn to use the Realtime API for live data updates via WebSocket connections. This enables real-time notifications when items are created, updated, or deleted in your collections.

## Table of Contents

- [Authentication](authentication.md) - WebSocket authentication modes (public, handshake, strict)
- [Subscriptions](subscriptions.md) - Subscribe to collection changes via WebSocket or GraphQL
- [Actions](actions.md) - Execute CRUD operations over WebSocket
- [Custom WebSocket Handlers](custom-websocket-handlers.md) - Server-side hook extensions for WebSocket events

## Quick Start

### 1. Enable WebSockets

Ensure WebSockets are enabled in your Likha ERP instance by setting `WEBSOCKETS_ENABLED=true` in your environment configuration.

### 2. Choose an Authentication Mode

Connect to the WebSocket server using one of three authentication modes:

- **Public** - No authentication required (limited to public role)
- **Handshake** - Send authentication as first message (default)
- **Strict** - Include access token as URL parameter

See [Authentication](authentication.md) for detailed examples.

### 3. Subscribe to a Collection

Once connected and authenticated, subscribe to changes in a collection:

```json
{
	"type": "subscribe",
	"collection": "messages"
}
```

You'll now receive real-time notifications whenever items in the `messages` collection are created, updated, or deleted.

### 4. Perform CRUD Actions (Optional)

You can also perform CRUD operations over the WebSocket connection. See [Actions](actions.md) for complete documentation.

## Heartbeat

To keep your connection alive, you may receive periodic `ping` messages. Respond with `pong` to prevent the connection from closing:

```js
connection.addEventListener('message', (message) => {
	const data = JSON.parse(message.data);

	if (data.type === 'ping') {
		connection.send(JSON.stringify({ type: 'pong' }));
	}
});
```


