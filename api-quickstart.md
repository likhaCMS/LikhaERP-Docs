# API Quickstart

Get started with the REST API. Learn to interact with collections, fetch, and create data.

This guide covers interacting with collections via the REST API. You will fetch and create data, and make your first requests.

## Before You Start

You will need a Likha ERP project with a collection created. Create a `posts` collection with at least a `title` and `content` field.

You also need an access token. In the management interface, go to your user detail page. Create a new token, take note of it, and then save.

## Fetching Data

Open your terminal and run the following command to read items from the `posts` collection.

```bash
curl \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
--url 'https://your-domain.com/api/items/posts'
```

**Replace values:**
- The Base URL (`https://your-domain.com`) must be replaced with your project URL.
- In the Authorization Header, replace `YOUR_ACCESS_TOKEN` with your access token.
- If you used a different collection, replace `posts` with the name of the collection.

The API will respond with an array of items. The default limit is 100, so if there are more than 100 items, you must either provide a higher limit or request a second page using pagination.

## Using Query Parameters

You can use any of the global query parameters to change the data that is returned.

```bash
curl \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --url 'https://your-domain.com/api/items/posts?filter[status][_eq]=published&fields=id,title'
```

This request will only show items with a `status` value of `published`, and only return the `id` and `title` fields.

See all available query parameters in the Query Parameters guide.

## Creating Data

All collections are given consistent endpoints. By sending a POST request to `/api/items/posts` with an object containing properties in the collection, a new item will be created.

```bash
curl \
	--request POST \
	--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
	--header 'Content-Type: application/json' \
	--data '{ "title": "Hello Universe!" }' \
  	--url 'https://your-domain.com/api/items/posts'
```

## Next Steps

All endpoints are documented in the API Reference, which also shows all expected parameters and properties in the payload. Explore the API Reference for detailed documentation on all available endpoints.