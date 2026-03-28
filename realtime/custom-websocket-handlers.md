# Custom WebSocket Handlers

Learn to build custom WebSocket message handlers, push messages to connected clients, and react to WebSocket events using hook extensions.

## Before You Start

You will need:

- WebSockets enabled in your Likha ERP instance (`WEBSOCKETS_ENABLED=true`)
- Familiarity with hook extensions - see the extensions quickstart and hooks reference

## React to Connection Events

Use `action` hooks to run logic when clients connect, disconnect, or authenticate. The callback receives a `client` object representing the WebSocket connection.

The `client` object has the following key properties:

| Property | Description |
|----------|-------------|
| `uid` | Unique identifier for the connection. |
| `send(data)` | Send a string message to the client. |
| `accountability` | Object containing `user` and `role` IDs after authentication. |

```js
export default ({ action }) => {
	action('websocket.connect', ({ client }) => {
		console.log(`Client connected: ${client.uid}`);
	});

	action('websocket.close', ({ client }) => {
		console.log(`Client disconnected: ${client.uid}`);
	});

	action('websocket.auth.success', ({ client }) => {
		console.log(`Authenticated: user ${client.accountability?.user}`);
	});
};
```

The `websocket.auth.failure` and `websocket.error` action events are also available for handling failed authentication attempts and connection errors.

## Handle Custom Message Types

Use an `action` on `websocket.message` to detect custom message types sent by clients. The `message` parameter is already parsed from JSON - you do not need to call `JSON.parse()`.

```js
export default ({ action }) => {
	action('websocket.message', ({ message, client }) => {
		if (message.type !== 'typing-indicator') return;

		console.log(`User ${client.accountability?.user} is typing in ${message.channel}`);
	});
};
```

This action runs **after** Likha ERP has processed the message. To modify or block messages **before** processing, use a filter instead.

## Intercept and Modify Messages

Use a `filter` on `websocket.message` to transform messages before they are processed. Filters receive the parsed message as the payload and must return it for processing to continue. To block a message entirely, throw an error.

```js
export default ({ filter }) => {
	filter('websocket.message', (message) => {
		if (message.type === 'subscribe' && !message.query?.fields) {
			message.query = { ...message.query, fields: ['id', 'date_created'] };
		}

		return message;
	});
};
```

**Note:** Filters are blocking - slow filter logic will delay message processing for the client. Keep filters fast and avoid expensive operations like database queries where possible.

## Push Messages to Clients

The `WebSocketService` is available through the hook's context and provides access to all connected clients. Use `clients()` to get the full set, or `broadcast()` to send a message to all (or a filtered subset of) clients.

```js
export default ({ action }, { services }) => {
	action('items.create', ({ payload, collection }) => {
		if (collection !== 'notifications') return;

		const wsService = new services.WebSocketService();

		wsService.broadcast(JSON.stringify({ type: 'notification', data: payload }));
	});
};
```

The `broadcast` method accepts an optional second argument to target specific users or roles:

```js
wsService.broadcast(
	JSON.stringify({ type: 'notification', data: payload }),
	{ user: '1a2b3c4d-...' }
);
```

If you need more control over which clients receive the message, use `clients()` to get the `Set` of connected clients and iterate over them directly:

```js
const wsService = new services.WebSocketService();

for (const client of wsService.clients()) {
	if (client.accountability?.role === 'admin-role-id') {
		client.send(JSON.stringify({ type: 'alert', data: payload }));
	}
}
```

**Note:** `WebSocketService` only provides access to REST WebSocket clients. GraphQL subscription and logs streaming clients are managed by separate controllers and are not accessible through this service.

## Next Steps

- [Hooks reference](/guides/extensions/api-extensions/hooks) - full list of filter and action events
- [Extensions quickstart](/guides/extensions/overview) - set up your first extension
- [Realtime configuration](/configuration/realtime) - WebSocket environment variables
- [Subscriptions](/guides/realtime/subscriptions) and [Actions](/guides/realtime/actions) - client-side WebSocket usage
