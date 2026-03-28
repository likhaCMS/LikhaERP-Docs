# Realtime Quickstart

This guide will cover connecting to Likha ERP via WebSockets on the web, subscribing to changes, and creating new items over the connection.

Instead of needing to make a request to see if data has changed, your application can receive updates in realtime over a persistent connection. All subscriptions and actions over a realtime connection use the permissions of the authenticated user, or public permissions if not authenticated.

This guide will cover getting started with Realtime by connecting to Likha ERP with the SDK on the web, subscribing to changes, and creating new items.

## Before You Start

You will need a Likha ERP instance.

Create a `messages` collection with a `date_created` field enabled on collection creation. Add `text` and `user` text fields. Follow the [data modeling quickstart](data-model-setup.md) to learn more.

Add an [access policy](/guides/auth/access-control) called **Public Posts** to your user in the Data Studio. Within it, create a new permission to allow the `read` and `create` actions on the `messages` collection.

In the Data Studio, create a [static token](/guides/auth/tokens-cookies) for your user, copy it, and save your user profile.

## Enable Realtime

Realtime is disabled by default on self-hosted projects. Set the `WEBSOCKETS_ENABLED` environment variable to `true`. If you use Likha ERP Cloud to host your project, you do not need to manually enable Realtime.

## Connect via SDK

Create an `index.html` file, import the SDK from a CDN, create a client with the `realtime` composable, and connect. Be sure to replace your Likha ERP URL and access token.

```html
<!doctype html>
<html>
	<body>
		<script>
			import { createLikha, staticToken, realtime } from 'https://www.unpkg.com/@likha/sdk/dist/index.js';

			const likha = createLikha('https://example.likhaerp.com')
				.with(staticToken('your_access_token'))
				.with(realtime());

			await likha.connect();
		</script>
	</body>
</html>
```

## Subscribe to Changes

After subscribing to collections over your connection, you will receive new messages whenever items in the collection are created, updated, or deleted.

At the bottom of your `<script>`, create a new subscription:

```js
const { subscription } = await likha.subscribe('messages', {
	event: 'create',
	query: { fields: ['user', 'text'] },
});

for await (const item of subscription) {
	console.log(item);
}
```

Your page will log on the console every time an item is created in the `messages` collection.

## Create an Item

You can also perform actions over an open Realtime connection. Create a new function that sends a message over the connection to create an item:

```js
function createItem(text, user) {
	likha.sendMessage({
		type: 'items',
		collection: 'messages',
		action: 'create',
		data: { text, user },
	});
}
```

Open your browser and create items by using your new function directly in the console:

```js
createItem('Hello World!', 'Ben');
createItem('Hello Universe!', 'Rijk');
createItem('Hello Everyone Everywhere All At Once!', 'Kevin');
```

## Log Messages

Use the `likha.onWebSocket()` method to listen for events that happen to the WebSocket connection.

```js
likha.onWebSocket('open', function () {
	console.log('Connection is open');
});

likha.onWebSocket('message', function (message) {
	console.log('New message of type ' + message.type);
	console.log(message.data);
});

likha.onWebSocket('close', function () {
	console.log('Connection has closed');
});

likha.onWebSocket('error', function (error) {
	console.log('Connection has had an error');
	console.log(error);
});
```

## Next Steps

Learn more about [authentication modes](realtime/authentication.md) and [how to manage subscriptions](realtime/subscriptions.md).
