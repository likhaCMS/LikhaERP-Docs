# Subscriptions

Learn to manage realtime subscriptions with both WebSockets and GraphQL.

## WebSocket Subscriptions

WebSocket subscriptions allow for real-time notification of item creations, edits, and deletions in a collection.

### Subscribe to Changes in a Collection

Send the following message over your WebSocket connection to start a subscription:

```json
{
	"type": "subscribe",
	"collection": "messages"
}
```

In return, you will receive a message to confirm that your subscription has been initialized:

```json
{
	"type": "subscription",
	"event": "init"
}
```

### Handling Collection Changes

When a change happens to an item in a collection with an active subscription, it will emit a message:

```json
{
	"type": "subscription",
	"event": "create",
	"data": [
		// ...
	]
}
```

The `event` will be one of `create`, `update`, or `delete`. If the event is `create` or `update`, the `data` will contain the full item objects (or specific fields, if specified). If the event is `delete`, just the `id` will be returned.

### Working with Specific CRUD Actions

Using the optional `event` argument you can filter for specific `create`, `update`, and `delete` events:

```json
{
	"type": "subscribe",
	"collection": "messages",
	"event": "create"
}
```

### Specifying Fields to Return

If you only want to return specific fields on subscription events, add the `query.fields` property when initializing the subscription:

```json
{
	"type": "subscribe",
	"collection": "messages",
	"query": { "fields": ["text"] }
}
```

Refer to the [Query Parameters](query-parameters.md) documentation for more information on specifying what data should be returned.

### Using UIDs

The `uid` property serves as a unique identifier included in the message payload. When multiple subscriptions are added to the same collection, the `uid` helps to distinguish the responses of these subscriptions watching different filters or events. A unique identifier will be generated on the server if not explicitly provided when subscribing.

**Note:** When manually setting the `uid` property its value needs to be unique per WebSocket connection. Any subsequent duplicate `uid` subscriptions will be ignored.

```json
{
	"type": "subscribe",
	"collection": "messages",
	"uid": "any-string-value"
}
```

When you receive responses, the same `uid` will be included as a property:

```json
{
	"type": "subscription",
	"event": "create",
	"data": [
		// ...
	],
	"uid": "any-string-value"
}
```

### Unsubscribing from Changes

To stop change events being sent from a specific subscription, send the following message:

```json
{
	"type": "unsubscribe",
	"uid": "identifier"
}
```

You can also omit `uid` to stop all subscriptions at once.

## GraphQL Subscriptions

GraphQL subscriptions provide live updates that are delivered in real-time whenever an item is created, updated or deleted in your collection.

### Setup

Establish a WebSocket connection between the client and server using `createClient` from `graphql-ws`. To authenticate, provide your Likha ERP URL and access token:

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

This creates a connection and ensures that only authorized clients can access the resources and real-time data updates.

### Subscribe to Changes in a Collection

Send the following query, `<collection>_mutated` over your WebSocket connection to subscribe to changes. If you want to subscribe to a `posts` collection, the query would look like this:

```graphql
subscription {
	posts_mutated {
		key
		event
		data {
			id
			text
		}
	}
}
```

In return, this query will subscribe to changes in the posts collection and return the `id` and `text` fields of the post added.

### Handling Collection Changes

When a change happens to an item in a collection with an active subscription, it will emit a response:

```json
{
	"posts_mutated": {
		"key": "1",
		"event": "create",
		"data": {
			"id": "1",
			"text": "Hello world!"
		}
	}
}
```

An event will be either `create`, `update`, or `delete`. If the event is `create` or `update`, the payload will contain the full item objects (or specific fields, if specified). If the event is `delete`, just the `key` will be filled and the other requested fields will be `null`.

### Working with Specific CRUD Operations

Using the `event` argument you can filter for specific `create`, `update`, and `delete` events:

```graphql
subscription {
	posts_mutated(event: create) {
		key
		data {
			text
		}
	}
}
```

### Unsubscribing from Changes

To unsubscribe from a subscription, use the `dispose` method:

```js
client.dispose();
```

Calling `dispose` sends a message to the server to unsubscribe from the specified subscription. This will stop receiving any further updates for that subscription.
