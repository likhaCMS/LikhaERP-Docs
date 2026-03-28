# Filter Rules

Filters are used throughout the Likha ERP API to query items based on specific conditions. This page documents the complete filter syntax, operators, and advanced features.

## Table of Contents

- [Available Operators](#available-operators)
- [Filter Syntax](#filter-syntax)
- [Relational Fields](#relational-fields)
- [_some vs _none](#_some-vs-_none)
- [Dynamic Variables](#dynamic-variables)
- [Logical Operators](#logical-operators)
- [Functions](#functions)
- [Follow Syntax](#follow-syntax)

---

## Available Operators

| Operator | Description |
|----------|-------------|
| `_eq` | Equals |
| `_neq` | Doesn't equal |
| `_lt` | Less than |
| `_lte` | Less than or equal to |
| `_gt` | Greater than |
| `_gte` | Greater than or equal to |
| `_in` | Is one of (array membership) |
| `_nin` | Is not one of |
| `_null` | Is null |
| `_nnull` | Isn't null |
| `_contains` | Contains (substring) |
| `_ncontains` | Doesn't contain |
| `_icontains` | Contains (case-insensitive) |
| `_nicontains` | Doesn't contain (case-insensitive) |
| `_starts_with` | Starts with |
| `_istarts_with` | Starts with (case-insensitive) |
| `_nstarts_with` | Doesn't start with |
| `_nistarts_with` | Doesn't start with (case-insensitive) |
| `_ends_with` | Ends with |
| `_iends_with` | Ends with (case-insensitive) |
| `_nends_with` | Doesn't end with |
| `_niends_with` | Doesn't end with (case-insensitive) |
| `_between` | Is between two values (inclusive) |
| `_nbetween` | Is not between two values (inclusive) |
| `_empty` | Is empty (null or falsy) |
| `_nempty` | Isn't empty (null or falsy) |
| `_intersects` | Intersects a point (geometry fields only) |
| `_nintersects` | Doesn't intersect a point (geometry fields only) |
| `_intersects_bbox` | Intersects a bounding box (geometry fields only) |
| `_nintersects_bbox` | Doesn't intersect a bounding box (geometry fields only) |
| `_regex` | Regular expression (escape backslashes) - validation only |
| `_some` | At least one related value is true (relational) |
| `_none` | No related values are true (relational) |

**Notes:**
- Numeric comparisons are not strictly typed, allowing comparisons between numbers and their string representations
- Geometry operators only available on geometry fields
- `_regex` only available in validation permissions
- `_some` and `_none` only available on One-to-Many and Many-to-Many relationship fields

---

## Filter Syntax

The basic filter structure is:

```json
{
  "field": {
    "operator": "value"
  }
}
```

- `field` can exist on the current collection or a relational collection
- `operator` must be any valid filter operator
- `value` can be any static value or dynamic variable

### Simple Example

Filter items where the title contains "article":

```json
{
  "title": {
    "_contains": "article"
  }
}
```

---

## Relational Fields

You can filter items based on related data by nesting field names.

### Many-to-One Relations

Filter based on fields of the related item:

```json
{
  "author": {
    "name": {
      "_eq": "Rijk van Zanten"
    }
  }
}
```

This filters articles where the related author's name equals "Rijk van Zanten".

### Many-to-Many Relations

For Many-to-Many relationships, you filter through the junction table:

```json
{
  "authors": {
    "authors_id": {
      "name": {
        "_eq": "Rijk van Zanten"
      }
    }
  }
}
```

For a books collection with a Many-to-Many relationship to authors (via a `books_authors` junction table), you need to go through the junction table and the foreign key field.

---

## _some vs _none

These operators filter One-to-Many and Many-to-Many relational fields.

### _some Operator

Matches items where **at least one** related item meets the condition. This is the **default** behavior for relational queries.

```json
{
  "categories": {
    "_some": {
      "name": {
        "_eq": "Recipe"
      }
    }
  }
}
```

The above explicitly uses `_some`. Since it's the default, this is equivalent:

```json
{
  "categories": {
    "name": {
      "_eq": "Recipe"
    }
  }
}
```

### _none Operator

Matches items where **none** of the related items meet the condition.

```json
{
  "categories": {
    "_none": {
      "name": {
        "_eq": "Recipe"
      }
    }
  }
}
```

This matches items where no category has the name "Recipe".

---

## Dynamic Variables

Dynamic variables are replaced with runtime values when the query executes.

| Variable | Description |
|----------|-------------|
| `$CURRENT_USER` | The primary key of the currently authenticated user |
| `$CURRENT_ROLE` | The primary key of the role for the currently authenticated user |
| `$NOW` | The current timestamp |
| `$NOW(<adjustment>)` | The current timestamp plus/minus a distance (e.g., `$NOW(-1 year)`, `$NOW(+2 hours)`) |

### Examples

Filter items created by the current user:

```json
{
  "owner": {
    "_eq": "$CURRENT_USER"
  }
}
```

Filter items from the last week:

```json
{
  "published_date": {
    "_gte": "$NOW(-1 week)"
  }
}
```

In permissions configuration, you can access nested fields:

```json
{
  "$CURRENT_ROLE.name": "admin"
}
```

---

## Logical Operators

Combine multiple filter rules using `_and` or `_or` logical operators. Each holds an array of filter rules. Logical operators can be nested.

### Structure

```json
{
  "_and": [
    { "field1": { "operator": "value" } },
    { "field2": { "operator": "value" } }
  ]
}
```

### Complex Example

```json
{
  "_or": [
    {
      "_and": [
        {
          "user_created": {
            "_eq": "$CURRENT_USER"
          }
        },
        {
          "status": {
            "_in": ["published", "draft"]
          }
        }
      ]
    },
    {
      "_and": [
        {
          "user_created": {
            "_neq": "$CURRENT_USER"
          }
        },
        {
          "status": {
            "_in": ["published"]
          }
        }
      ]
    }
  ]
}
```

---

## Functions

Functions accept a field and return a modified value. Use them in any query parameter where you'd normally supply a field key (including `fields`, aggregation, and filters).

**Syntax:** `function(field)`

| Function | Description |
|----------|-------------|
| `year()` | Extract year from datetime/date/timestamp |
| `month()` | Extract month from datetime/date/timestamp |
| `week()` | Extract week from datetime/date/timestamp |
| `day()` | Extract day from datetime/date/timestamp |
| `weekday()` | Extract weekday from datetime/date/timestamp |
| `hour()` | Extract hour from datetime/date/timestamp |
| `minute()` | Extract minute from datetime/date/timestamp |
| `second()` | Extract second from datetime/date/timestamp |
| `count()` | Count items in JSON array or relational field |
| `json()` | Extract value from JSON field using path notation |

### Example

Filter items published in April 1968:

```json
{
  "_and": [
    {
      "year(published_date)": {
        "_eq": 1968
      }
    },
    {
      "month(published_date)": {
        "_eq": 4
      }
    }
  ]
}
```

---

## Follow Syntax

The `$FOLLOW(target-collection, relation-field)` syntax allows querying indirect relations when no direct relation field exists in the current collection.

### Use Case

When you have two collections (e.g., `countries` and `cities`) where `cities` has a Many-to-One relation to `countries` via `country_id`, but the `countries` collection has no direct relation field to `cities`. You can still filter countries based on city fields.

### Example

Find countries that have a city named "Berlin":

```json
{
  "filter": {
    "name": "Germany",
    "$FOLLOW(cities, country_id)": {
      "name": "Berlin"
    }
  }
}
```

This filters the `countries` collection by following the relation to `cities` through the `country_id` field.

---

## Usage in API Requests

When making API requests, filters are passed as a query parameter:

```http
GET /api/items/articles?filter={"status":{"_eq":"published"}} HTTP/1.1
```

---


## Notes

- Filter keys are case-sensitive and must match field names exactly
- For complex filters, consider URL encoding the JSON when using raw HTTP
- The `filter` parameter can be combined with other query parameters like `sort`, `limit`, `offset`
- Not all operators are available in all contexts (e.g., `_regex` is validation-only)
- Test complex filters in a safe environment before deploying to production
- Use the `fields` parameter to limit returned data when using filters with relational fields to avoid over-fetching