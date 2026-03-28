# Query Parameters

Learn about query parameters - fields, filter, search, sort, limit, offset, page, aggregate, groupBy, deep, alias, and export. Understand how to customize your API requests and retrieve specific data from your collections.

Most Likha ERP API endpoints can use global query parameters to alter the data that is returned.

## Fields

Specify which fields are returned. This parameter also supports dot notation to request nested relational fields, and wildcards (`*`) to include all fields at a specific depth.

### Examples

| Value                  | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `first_name,last_name` | Return only the `first_name` and `last_name` fields.               |
| `title,author.name`    | Return `title` and the related `author` item's `name` field.       |
| `*`                    | Return all fields.                                                 |
| `*.*`                  | Return all fields and all immediately related fields.              |
| `*,images.*`           | Return all fields and all fields within the `images` relationship. |

### Many to Any Fields

As Many to Any (M2A) fields have nested data from multiple collections, you are not always able to fetch the same field from every related collection. In M2A fields, you can use the following syntax to specify what fields to fetch from which related nested collection type: `fields=m2a-field:collection-scope.field`

**Example:**  
In a `posts` collection there is a Many to Any field called `sections` that points to `headings`, `paragraphs`, and `videos`. Different fields should be fetched from each related collection.

```http
GET /items/posts
	?fields[]=title
	&fields[]=sections.item:headings.title
	&fields[]=sections.item:headings.level
	&fields[]=sections.item:paragraphs.body
	&fields[]=sections.item:videos.source
```

### Wildcards and Performance

While wildcards are very useful, we recommend only requesting specific fields in production. By only requesting the fields you need, you can speed up the request, and reduce the overall output size.

---

## Filter

Specify which items are returned based on the result of a filter rule. See [Filter Rules](filters.md) for complete syntax.

### Examples

```http
GET /items/posts?filter[title][_eq]=Hello
```

or

```http
GET /items/posts?filter={"title":{"_eq":"Hello"}}
```

---

## Search

Search on all string and text type fields within a collection. It's an easy way to search for an item without creating complex field filters – though it is far less optimized. Related item fields are not included.

```http
GET /items/posts?search=article
```

---

## Sort

What fields to sort results by. Sorting defaults to ascending, but appending a `-` will reverse this. Fields are prioritized by the order in the parameter. The dot notation is used to sort with values of related fields.

```http
GET /items/posts?sort=sort,-date_created,author.name
```

---

## Limit

Set the maximum number of items that will be returned. The default limit is set to `100`. `-1` will return all items.

```http
GET /items/posts?limit=50
```

**Large limits and performance:**  
Depending on the size of your collection, fetching the maximum amount of items may result in degraded performance or timeouts.

The maximum number of items that can be requested on the API can be configured using the `QUERY_LIMIT_MAX` environment variable. This cannot be overridden by changing the value of `limit`.

---

## Offset

Skip the specified number of items in the response. This parameter can be used for pagination.

```http
GET /items/posts?offset=100
```

---

## Page

An alternative to `offset`. Returned values are the value of `limit` multiplied by `page`. The first page is `1`.

```http
GET /items/posts?page=2
```

---

## Aggregate

Aggregate functions allow you to perform calculations on a set of values, returning a single result.

| Function        | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| `count`         | Counts how many items there are                               |
| `countDistinct` | Counts how many unique items there are                        |
| `sum`           | Adds together the values in the given field                   |
| `sumDistinct`   | Adds together the unique values in the given field            |
| `avg`           | Get the average value of the given field                      |
| `avgDistinct`   | Get the average value of the unique values in the given field |
| `min`           | Return the lowest value in the field                          |
| `max`           | Return the highest value in the field                         |
| `countAll`      | Equivalent to `?aggregate[count]=*` (GraphQL only)            |

**Example:**

```http
GET /items/posts?aggregate[count]=*
```

---

## GroupBy

Grouping allows for running aggregate functions based on a shared value, rather than the entire dataset.

You can group by multiple fields simultaneously. Combined with the functions, this allows for aggregate reporting per year-month-date.

**Example:**

```http
GET /items/posts
  ?aggregate[count]=views,comments
  &groupBy[]=author
  &groupBy[]=year(publish_date)
```

---

## Deep

Deep allows you to set any of the other query parameters (except for `fields` and `deep` itself) on a nested relational dataset.

The nested query parameters are to be prefixed with an underscore.

### Examples

```http
GET /items/posts?deep[translations][_filter][languages_code][_eq]=en-US
```

or

```http
GET /items/posts?deep={"translations":{"_filter":{"languages_code":{"_eq":"en-US"}}}}
```

**Only get 3 related posts, with only the top rated comment nested:**

```json
{
  "deep": {
    "related_posts": {
      "_limit": 3,
      "comments": {
        "_sort": "rating",
        "_limit": 1
      }
    }
  }
}
```

---

## Alias

Rename fields for this request, and fetch the same nested data set multiple times using different filters.

**Example:**

```http
GET /items/posts
	?alias[all_translations]=translations
	&alias[dutch_translations]=translations
	&deep[dutch_translations][_filter][code][_eq]=nl-NL
```

**Aliases in combination with other features:**

1. Functions: `alias[release_year]=year(released)`
2. In the deep query parameter: `deep[author][_alias][birthyear]=year(birthday)`

Note that it is not possible to use aliases on relational fields (e.g., `alias[author_name]=author.name`) and not possible to have `.` in the alias name itself (e.g., `alias[not.possible]=field`).

---

## Export

Saves the API response to a file. Valid values are `csv`, `json`, `xml`, `yaml`.

```http
GET /items/posts?export=csv
```

---

## Version

Queries a version of a record by version key when content versioning is enabled on a collection. Applies only to single item retrieval.

```http
GET /items/posts/1?version=v1
```

---

## VersionRaw

Specifies to return relational delta changes as a detailed output on a version record.

```http
GET /items/posts/1?version=v1&versionRaw=true
```

---

## Functions

Functions accept a field and return a modified value. Functions can be used in any query parameter you'd normally supply a field key, including fields, aggregation, and filters.

The syntax for using a function is `function(field)`.

| Function | Description |
|----------|-------------|
| `year` | Extract the year from a datetime/date/timestamp field |
| `month` | Extract the month from a datetime/date/timestamp field |
| `week` | Extract the week from a datetime/date/timestamp field |
| `day` | Extract the day from a datetime/date/timestamp field |
| `weekday` | Extract the weekday from a datetime/date/timestamp field |
| `hour` | Extract the hour from a datetime/date/timestamp field |
| `minute` | Extract the minute from a datetime/date/timestamp field |
| `second` | Extract the second from a datetime/date/timestamp field |
| `count` | Extract the number of items from a JSON array or relational field |
| `json` | Extract a specific value from a JSON field using path notation |

**Example:**

```http
GET /items/posts?filter[year(date_published)][_eq]=1968
```

---

## Backlink

When `backlink` is set to `false`, the API will exclude reverse relations during `*.*` wildcard field expansion to prevent circular references and reduce duplicate data in responses.

The backlink parameter defaults to `true`, so you need to explicitly set it to `false` to enable the filtering behavior.

**Note:** The backlink parameter only affects `*.*` wildcard field expansion. Explicitly specified field names are not filtered. For example: `fields=author.articles` will still include the reverse relation even when `backlink=false`.

**Example:**

```http
GET /items/posts?fields=*.*.*&backlink=false
```

---

## Notes

- All query parameters are optional unless otherwise specified
- Parameters can be combined in a single request
- When using raw HTTP, remember to URL-encode JSON values in query parameters
- The `filter` parameter has its own comprehensive documentation - see [Filter Rules](filters.md)
- Some parameters may not be available on all endpoints (e.g., `version` only on single item retrieval)
- Consider performance implications when using wildcards (`*`) or deep nesting with `deep`
- Use the `fields` parameter to optimize response size by limiting returned data
