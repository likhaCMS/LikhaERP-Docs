# Transform Files

Images can be transformed via URL query parameters, commonly used to provide the most suitable size and file format. Files can be transformed using URL query parameters. If a processed asset does not yet exist, it is dynamically generated, stored, and returned.

## Basic Transformations

Add the following query parameter to the end of your file URL:

```
?width=200
```

Your new URL should look like this:

```
https://your-domain.com/assets/<file-id>?width=200
```

Other transformation parameters include `height`, `quality`, `format`, and more. These transformations are applied on-the-fly and can be combined.

## Custom Transformations

| Parameter | Description |
|-----------|-------------|
| `width` | How wide the image is in pixels. |
| `height` | How high the image is in pixels. |
| `quality` | The overall image quality (1 to 100). Higher value = larger file size, lower value = more compression. |
| `withoutEnlargement` | Disable automatically upscaling the image (true) |
| `format` | What file format to return the image in. Options: auto, jpg, png, webp, tiff. Auto defaults to webp/avif if supported, otherwise jpg. |
| `fit` | How the image should fit into the provided dimensions:<br>- `cover` (default): fit while preserving aspect ratio<br>- `contain`: contain within dimensions with letterboxing<br>- `inside`: resize as large as possible within dimensions<br>- `outside`: resize as small as possible within or beyond dimensions |

> **Focal Points**
> When transforming an image with `width` and/or `height` parameters, the focal point is taken from the `focal_point_x` and `focal_point_y` coordinate values stored in the file object, cropping the image around these. This defaults to the image's centre.

**Example Request:**

```http
GET /api/assets/c984b755-e201-497e-b0a7-24156ad9c7e0
	?width=300
	&height=300
	&quality=50
	&fit=contain
```

## Advanced Transformations

The system provides access to advanced image transformations using a `transforms` parameter. This parameter consists of a two-dimensional array. Each sub-array contains the name of the operation, followed by its arguments: `[["operation1", ...arguments], ["operation2", ...otherArguments]]`.

> **REST Values**
> When calling the REST API, datatypes like booleans need to be passed as strings.

| Sharp API Call | transforms Equivalent |
|---------------|----------------------|
| `.rotate(90)` | `[["rotate", 90]]` |
| `.rotate(90).blur(10).tint(255, 0, 255)` | `[["rotate", 90], ["blur", 10], ["tint", "rgb(255, 0, 255)"]]` |
| `negate({lower: 10, upper: 50})` | `[["negate", {"lower": 10, "upper": 50}]]` |

**Example Request:**

```http
GET /api/assets/c984b755-e201-497e-b0a7-24156ad9c7e0
	?transforms=[["rotate", 90],["blur", 10],["tint", "rgb(255, 0, 255)"], ["negate", {"lower": 10, "upper": 50}]]
```

Custom and advanced transformations can also be used in conjunction.

**Example Request (combined):**

```http
GET /api/assets/c984b755-e201-497e-b0a7-24156ad9c7e0
	?transforms=[["flip"]]
	&fit=cover
	&width=300
	&height=100
```

## Preset Transformations

In order to mitigate the creation of a large number of files, you can restrict the transformations to a set of presets. You can create your own storage asset preset in the settings section.

The following options are available:

- **Allowed Transformations**: for enabling, disabling, or limiting image transformations.
- **Default Folder**: sets the default folder where new assets are added. This does not affect existing files. Be aware that fields may override this value.
- **Transformation Presets**: sets a specific image transformation configuration to simplify requests or limit usage.
  - **Key**: sets unique identifier allowing faster and easier image transformation requests.
  - **Fit**: contain (keeps aspect ratio), Cover (exact size), Fit Inside, or Fit Outside.
  - **Width**: sets the width of the image.
  - **Height**: sets the height of the image.
  - **Quality**: adjusts the compression or quality of the image.
  - **Upscaling**: when enabled, images won't be upscaled.
  - **Format**: changes the output format.
  - **Additional Transformations**: adds additional transformations using the underlying image processing library.

You can then use this `key` as a parameter when requesting a file to apply the preset.

