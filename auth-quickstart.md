# Authentication Quickstart

Get started with authentication. Learn how to register, login, and make authenticated requests.

This guide covers registering users, logging in, and making an authenticated request.

## Before You Start

You will need a Likha ERP project with a collection created. Create a `posts` collection with at least a `title` and `content` field. Create a single item in the collection.

## Creating a Role and a Policy

From your settings, navigate to User Roles and create a new role named "User". This role will later be applied to new users who register.

Within the role page, create a new policy named "Read Posts". Add a permission to the policy to allow **Read** action on `posts` collection.

## Allow User Registration

From your settings, enable User Registration. Select the User role that was just created and disable the Verify Email setting for simplicity.

## Registering via the Management Interface

Log out of the management interface. From the Sign In screen, you will see a sign up option. Once a user signs up, they will immediately be able to log in.

## Registering via API

Open your terminal and run the following command to register a new user.

```bash
curl \
	--request POST \
	--header 'Content-Type: application/json' \
	--data '{ "email": "hello@example.com", "password": "password123" }' \
	--url 'https://your-domain.com/users/register'
```

Go to the user directory and you should see a new user has been created.

## Logging In

```bash
curl \
	--request POST \
	--header 'Content-Type: application/json' \
	--data '{ "email": "hello@example.com", "password": "password123" }' \
	--url 'https://your-domain.com/auth/login'
```

The response will include an `access_token` and `refresh_token`.

## Authenticating Requests

Include the access token in the Authorization header when making requests. If your token has expired, you must refresh it.

```bash
curl \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
--url 'https://your-domain.com/items/posts'
```


