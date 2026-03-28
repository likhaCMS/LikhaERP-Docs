# Automation Quickstart

Get started using flows, triggers, operations, and the data chain to create custom event-driven data processing.

This guide covers creating a simple flow that sends a notification when a post is created.

## Before You Start

You will need a Likha ERP project with a `posts` collection containing at least `title` and `content` fields.

## Create a Flow

Navigate to the Flows section in the Settings module. Click the add button in the page header and name the new flow "Post Created".

## Configure a Trigger

Click on the trigger configuration area. Select "Event Hook" as the trigger type and select "Action (Non-Blocking)". This allows the flow to respond to events without interrupting the transaction.

Select `items.create` as the scope, and then check the "Posts" collection. This means the flow will be triggered when a post is created.

## Configure an Operation

Click the add button on the trigger panel to create an operation. Give it the name "Notify Post Created" (the key will be auto-generated).

Select the "Send Notification" operation type. Fill in the "User" field with the UUID of your user, which can be found in the user directory. Under "Permissions", select "From Trigger", which will cause the operation to have the same permissions as those from the trigger.

Fill in the "Subject" and "Message" fields as desired, leaving "Collection" and "Item" blank.

When finished, save the flow.

Now, when you create a post, the user you entered will be notified.

## Next Steps

Read more about different [triggers](triggers.md) available in flows and how data is passed through a flow with [the data chain](data-chain.md).