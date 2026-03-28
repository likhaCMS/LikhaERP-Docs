# Configure a Data Model

This guide covers creating a collection, creating fields, and configuring relationships.

## Creating a Collection

Log into the management interface as an administrator. If this is a brand-new project, you will be presented with the option to create your first collection. Otherwise, go to the settings module and create a new collection from the Data Model page.

Set the name of this collection to be `posts`, leaving all other options in both the collection setup and optional field pages as their defaults. You now have a new collection with only a primary key.

## Creating Fields

Your collection only has a primary key. From your new `posts` collection configuration page, click the **Create Field** button and select the Input interface. Set the key to `title` and leave all other options as their defaults.

Create another new field with a What You See Is What You Get (WYSIWYG) interface. Set the key to `content`.

## Configuring a Relationship

Create a new collection called `authors`. In the new collection, create a new field with an Input interface and set the key to `name`.

Go to the `posts` collection configuration and create a new field with the Many to One interface and set the key to `author`. Set the related collection to `authors` and configure the Display Template to show just the author's name by selecting the `name` field.

Now that you have successfully configured a relationship between the two tables, you can start creating data.

In the module bar, go to the content module. Enter your `authors` collection and create 2 authors with the names `Ben Haynes` and `Rijk van Zanten`.

Enter the `posts` collection and create two posts, selecting an author from the Many to One interface.

## Next Steps

Read the full [API Reference](README.md) to learn about all available endpoints and features. Access your new collections via the API.