# Dashboards & Panels

Dashboard composition, panel option shapes, and the chart-flow recipe for custom visualizations.

## Discovering Panel Types

`GET /extensions?limit=-1` enumerates every installed panel, interface, layout, and module — each row carries `schema.type` and `schema.name`. `/panels` only shows *instantiated* panels, so use `/extensions` to discover what a dashboard can use.

Panel type ids are registered by each extension and are **not** inferable from display names — read the value from `GET /extensions` rather than guessing.

Panels shipped with the platform include:

| Type | Purpose |
| --- | --- |
| `echarts-panel` | Apache ECharts visualizations driven by a flow |
| `likhaHeatmap-panel` | Map heatmap + clustering over a geometry field |
| `choropleth-map-panel` | Colors a boundary/geometry column by a metric |
| `table-view-panel` | Compact table of collection rows |
| `calendar-panel` | Calendar over a date field |
| `likhaButtonLink-panel` | Button/link shortcuts |
| `flow-triggers-panel` | Trigger flows on demand from a dashboard |

## The ECharts Panel

The `echarts-panel` draws whatever a flow returns. Panel options:

```json
{ "flow": { "key": "<flow-uuid>", "collection": "system_flows" } }
```

On render the panel calls `GET /flows/trigger/{id}` and passes the last operation's return value to ECharts — so that return value must be a **plain ECharts option object**.

### Chart Flow Recipe

```
trigger:   webhook
accountability: all
options:   { "error_on_reject": true }
ops:       sql_1 (likha_sql)  →  chart (Run Script)
```

The Run Script returns the option object:

```js
module.exports = async function (data) {
  const rows = data.sql_1.rows || data.sql_1;
  return {
    xAxis: { type: 'category', data: rows.map(r => r.label) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: rows.map(r => r.total) }]
  };
};
```

Wire `sql_1.resolve = chart.id`, then set `flow.operation = sql_1.id`. Verify with `GET /flows/trigger/{id}` — you should see the raw option JSON.

Two constraints to remember:

- The returned option cannot contain **functions** (`formatter`, `valueFormatter`) — use string templates like `'{b}: {c}'`.
- The panel invokes the flow via GET; a flow restricted to `POST` will 403.

## Native Panel Option Shapes

```jsonc
// metric
{ "collection": "app_orders", "field": "id", "function": "count",
  "filter": { "...": "..." }, "sortField": null }

// bar-chart
{ "collection": "app_orders", "column": "status", "legend": "...", "xAxis": "created_at" }

// pie-chart
{ "collection": "app_orders", "column": "status" }

// variable (dashboard filter)
{ "type": "variable" }
```

`function` accepts `count | sum | avg | min | max`. The metric `filter` is a normal filter object and **`$NOW` works** — handy for "upcoming" counts. You can pre-verify a metric's number with an aggregate query:

```
/items/app_orders?aggregate[count]=id&aggregate[sum]=total
```

## Layout Grid

The dashboard canvas is roughly 56 grid units wide. A metric panel is about 8×9; an echarts panel about 27×22. Set `show_header: true` to render the panel's `name`.

## The Heatmap Panel

The heatmap panel queries a collection directly (limit 1000) — **no flow reference**. Options:

```jsonc
{
  "collection": "app_locations",
  "geoField": "point",                 // GeoJSON Point, "lat,lng", {lat,lng}, or array
  "field": "severity",                 // optional numeric metric — see warning below
  "filter": { "...": "..." },
  "popupFields": ["name", "site.name"],// dot-notation supported
  "showHeader": true,
  "autoFitBounds": true,
  "defaultCenter": { "type": "Point", "coordinates": [120.98, 14.6] },
  "defaultZoom": 11,
  "defaultBearing": 0,
  "colorScheme": "viridis",            // coolwarm | viridis | plasma | grayscale | spectral
  "heatmapRadius": 30,
  "heatmapIntensity": 1,
  "showCircleLayer": true,
  "heatmapMaxZoom": 15,
  "circleMinZoom": 12,
  "transitionRange": 2,
  "enableClustering": true,
  "clusterRadius": 40,
  "clusterAggregation": "count",       // count | sum | avg | min | max
  "clusterCategories": []
}
```

Warnings learned the hard way:

- **The panel's options UI is buggy** — clicks can throw and nothing saves. Configure heatmap panels via `PATCH /panels/{id}` with the full options JSON.
- **`field` must be a real numeric field.** An undefined `field` crashes the layer; a nonexistent name silently falls back to intensity 1 and your legend/popups look wrong. If the collection has no natural metric, add one (a severity 1–5, a risk score) — or omit `field` entirely.
- **Cluster clicks need a numeric `field`** to show meaningful values; cluster features carry no per-record `popupFields`.

## Choropleth Maps

The choropleth panel colors a geometry/boundary column by a value — the standard way to render per-region metrics over `geometry.MultiPolygon` boundary fields.

## `csv` Fields in SQL

`csv` fields store a JSON-array string (`["youth","seniors"]`), not comma-separated text. Expand in SQL with `jsonb_array_elements_text(col::jsonb)` — `string_to_array(col, ',')` yields broken `["a"]`-style rows.

## After Extension Updates

When platform extensions are updated server-side, the served bundle changes — users must hard-refresh (Ctrl/Cmd-Shift-R) to pick up fixes.
