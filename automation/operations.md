# Operations

Operations are the individual actions in a flow. They enable you to do things like manage data, transform the flow's data, send information off to outside services, set conditional logic, trigger other flows, and more.

## Condition

A condition operation lets you choose a success path or failure path by validating data passed into it with filter rules.

### Options

- **Condition Rules** — Create conditions with filter rules. See [Filter Rules](filters.md) for complete syntax.

### Payload

This operation does not generate data. If the filter rule is configured properly, it will append a `null` value on its `operationKey`, regardless of if the condition was met or not. However, if the filter rule is misconfigured, it will append an array containing an object you can use to help debug the misconfiguration.

> **Note:** All fields referenced in condition rules must exist in the data being validated. If a field is missing from the payload (rather than being explicitly `null`), the condition takes the reject path regardless of the operator. To handle fields that may be absent, use the inverse operator (such as `_nnull`) and place your logic on the reject path instead.

> **Warning: Transaction Cancellation**
> When using an Event Hook trigger configured to be "Filter (Blocking)", if your flow ends with a condition that executes with a `reject` path, it will cancel your database transaction.

## Run Script

This operation lets you add a custom script using vanilla JavaScript or TypeScript. The script will be executed securely in an isolated sandbox. No interactions take place between the sandbox and the host except for sharing input and output values. This means, for example, no access to the file system and no ability to do network requests.

### Options

The operation provides a default function template. The optional `data` parameter lets you pass in the data chain as an argument.

### Payload

The function's `return` value will be appended under its `<operationKey>`.

### More Details

As an example, let's say you have this function in a script operation, named `myScript`.

```json
// A key from the data chain
{
	"previousOperation": {
		"value": 5
	}
}
```

Then you add the following logic via Run Script.

```typescript
// Your function in the myScript operation
module.exports = function (data) {
	return {
		timesTwo: data.previousOperation.value * 2,
	};
};
```

The returned value will be appended under the `myScript` operation key.

```json
{
	"previousOperation": {
		"value": 5
	},
	"myScript": {
		"timesTwo": 10
	}
}
```

> **Note:** Make sure your `return` value is valid JSON.

> **Throwing Errors**
> If you throw an error in a Run Script operation, it will immediately break your flow chain and stop execution of subsequent flows. If you used a "Blocking" Event hook trigger, throwing an error will cancel the original event transaction to the database.

> **Node Modules**
> To prevent unauthorized access to the underlying server, node modules can't be used in the Run Script operation. If you require a third party library for your custom script, you can create a custom operation extension instead.

## Create Data

This operation creates item(s) in a collection.

### Options

- **Collection** — Select the collection you'd like to create items in.
- **Permissions** — Select the scope of permissions used for this operation.
- **Emit Events** — Toggle whether the event is emitted.
- **Payload** — Defines the payload to create item(s) in a collection.

### Payload

An array with the ID(s) of all items created will be appended under its `<operationKey>`.

> **Note:** To learn about payload requirements when creating an item, see the Items API reference.

## Read Data

This operation reads items from a collection and adds them onto the data chain. You may select Items by their ID or by running a query.

### Options

- **Permissions** — Set the scope of permissions used for this operation.
- **Collections** — Select the collection you'd like to read items from.
- **IDs** — Input the ID for items you wish to read and press enter. Click the ID to remove.
- **Query** — Select the items with a query. To learn more, see [Filter Rules](filters.md).
- **Emit Events** — Toggle whether the event is emitted.

### Payload

An array containing all items read will be appended under its `<operationKey>`.

## Update Data

This operation updates item(s) in a collection. You may select item(s) to update by their ID or by running a query.

### Options

- **Collection** — Select the collection on which you'd like to update items in.
- **Permissions** — Set the role that this operation will inherit permissions from.
- **Emit Events** — Toggle whether the event is emitted.
- **IDs** — Input the ID for Item(s) you wish to update and press enter. Click the ID to remove.
- **Payload** — Update Items in a collection, using one of the following formats:
  - Single object with data, to update items specified in IDs or Query to the same values.
  - Single object with keys and data, to update multiple items to the same values.
  - Array of objects with data including primary keys, to update multiple items to different values.
  - To learn more, see the Items API reference.
- **Query** — Select items to update with a query. To learn more, see [Filter Rules](filters.md).

### Payload

An array containing all items updated will be appended under its `<operationKey>`.

> **Note:** To learn about payload requirements when updating an item, see the Items API reference.

## Delete Data

This operation deletes item(s) from a collection.

### Options

- **Collection** — Select the collection you'd like to delete items from.
- **Permissions** — Set the scope of permissions used for this operation.
- **Emit Events** — Toggle whether the event is emitted.
- **IDs** — Set Item IDs and press enter to confirm. Click the ID to remove.
- **Query** — Select items to delete with a query. To learn more, see [Filter Rules](filters.md).

### Payload

An array with the ID(s) of all items deleted will be appended under its `<operationKey>`.

## JSON Web Token (JWT)

This operation lets you sign and verify a JSON Web Token (JWT) using the `jsonwebtoken` package.

### Options

- **Operation** — Select the operation you'd like to perform.
- **Payload** — The string or JSON payload to sign.
- **Token** — The JSON Web Token to verify or decode.
- **Secret** — The secret key used to sign or verify a token.
- **Options** — The options object provided to the operation. For the list of available options, see the documentation of `jsonwebtoken`.

### Payload

Based on the operation selected, a JSON Web Token (JWT) or `payload` will be appended under its `<operationKey>`.

## Log to Console


This operation outputs information to the server-side console as well as the logs within the management interface. This is a key tool for troubleshooting flow configuration. A log operation's key will have a null value on the data chain.

### Options

- **Message** — Sets a log message.

### Payload

This operation does not generate data for the data chain as its messages are for debugging and troubleshooting. It will append a `null` value on the `operationKey`.

## Send Email


This operation sends emails off to one or more addresses specified.

> **Note:** If you are self-hosting, then you need to make sure that email capabilities are correctly configured.

### Options

- **To** — The recipient email addresses.
- **Subject** — The email subject line.
- **CC** — Email addresses to be copied.
- **BCC** — Email addresses to be blind copied.
- **Reply To** — The email address replies will be sent to.
- **Type** — The email body format: `WYSIWYG`, `Markdown`, or `Template`.
- **Body** — Available for `WYSIWYG` and `Markdown` types. Use the editor to compose the email content.
- **Template** — Available when the type is set to `Template`. Select the template to use.
- **Data** — Available when the type is set to `Template`. Variables injected into the selected template.

### Payload

This operation does not generate data for the data chain. It will append a `null` value on the `operationKey`.

> **Batch Emails**
> You can input an array of emails in the `To` input option to send off multiple emails.

> **Testing from localhost**
> If you are testing out this operation from localhost, be sure to check your spam box, because your email provider may send it there automatically.

## Send Notification


This operation pushes notifications to users. If the operation executes successfully, a list containing the IDs of all sent notifications generated is appended under this operation's key.

### Options

- **Users** — Define a user by their UUID. Hit enter to save it. Click on a pill to remove it.
- **Permissions** — Define the role that this operation will inherit permissions from.
- **Title** — Set the title of the notification.
- **Message** — Set the main body of the notification.

### Payload

This operation does not generate data. It will append a `null` value on its `operationKey`.

> **Batch Notifications**
> You can input an array of UUIDs in the `To` input option to send off multiple notifications.

## Webhook / Request URL


This operation makes a request to another URL.

### Options

- **Method** — Choose to make a GET, POST, PATCH, DELETE, or other type of request.
- **URL** — Define the URL to send the request to.
- **Headers** — Create a new `header:value` to pass along with the request.
- **Request Body** — Set the request body's data.

### Payload

When an operation completes successfully, the `response` is appended under its `<operationKey>`.

## Sleep


This operation creates a delay in the Flow for a given amount of milliseconds, then continues to the next operation.

### Options

- **Milliseconds** — Define the number of milliseconds to sleep.

### Payload

This operation does not generate data. It will append a `null` value on its `operationKey`.

## Throw Error


This operation throws a custom error to halt flow execution with a specific error code, HTTP status, and message.

### Options

- **Error Code** — Select from predefined error codes or enter a custom error code.
- **HTTP Status Code** — Choose the HTTP status code to return with the error.
- **Error Message** — Set a custom error message that describes the error condition.

### Payload

This operation does not generate data. It immediately throws an error that halts flow execution.

> **Warning: Transaction Cancellation**
> When using an Event Hook trigger configured to be "Filter (Blocking)", if your flow ends with a Throw Error operation, it will cancel your database transaction.

## Transform Payload


This operation lets you custom define your own JSON payload for use in subsequent operations. This enables you to take multiple sources of data and consolidate them into a single payload.

### Options

- **JSON** — Define JSON to insert into the data chain.

### Payload

When an operation completes successfully, the value you defined under the JSON configuration operation is appended onto its `operationKey`.

## Trigger Flow


This operation starts another flow and (optionally) passes data into it. It should be used in combination with the Another Flow trigger.

### Options

- **Flow** — Define a flow by its primary key UUID.
- **Payload** — Defines a JSON `payload` to pass into `$trigger` on the flow it triggered.
- **Iteration Mode** - Specifies how triggered flows are executed. Supported modes are `Serial`, `Parallel`, and `Batch`.
  - `Serial`: Runs the selected flow for each item in the payload sequentially, starting the next only after the previous execution completes.
  - `Batch`: Runs the selected flow for each item in the payload concurrently within a batch, starting the next batch only after the previous one completes.
  - `Parallel`: Runs the selected flow for each item concurrently and waits for all executions to complete, with no guaranteed order.
- **Batch Size** - Available when `Iteration Mode` is set to `Batch` it defines the number of items processed per batch.

### Payload

If you've configured a response body in the trigger of the other flow, this will be appended under this `operationKey`. If no response body is configured, `null` is appended under this `operationKey`.

> **Flows for-loops**
> If you pass an array to the other flow, the other flow will run once for each item in the array.

