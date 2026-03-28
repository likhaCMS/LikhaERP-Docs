# Access Files

Learn how to retrieve and download files from your Likha ERP instance. Folders and file information are stored in regular collections, which means user and role access permissions are fully configurable and granular on both folders and files.

## Access a File

The uploaded file is immediately available via the management interface for users with the correct access control. From here, you can download, edit, or replace files.

You can access files via URL in your applications by using the following URL pattern:

```
https://your-domain.com/assets/<file-id>
```

If the public role has read access, the file is publicly accessible. Otherwise, you may need to include an access token in the request.

### Authentication

The system leverages stored cookies to authenticate when accessing files, when present.

If no cookie is stored, you can use the `access_token` query parameter to authenticate, provided the token belongs to a user with the required access to read the file.

### SEO-Friendly URLs

You can provide an optional filename after the UUID to optimize for SEO, for example:

```
https://your-domain.com/assets/<file-id>/<filename>
```

For example:

```
https://your-domain.com/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4/logo.png
```

This optional filename is also used in the `Content-Disposition` header when the `?download` query parameter is used.

> **Direct File Access**
>
> While you may technically be able to expose your storage adapters root file system and access your raw files through there, it is recommended that you always use the API. This is the only way that you can take advantage of file permissions and other built-in features.

### Downloading a File

To download an asset with the correct filename, you need to add the `?download` query parameter to the request and the `download` attribute to your anchor tag. This will ensure the appropriate `Content-Disposition` headers are added. Without this, the download will work on the same domain, however it will have the file's "id" as the filename for cross-origin requests.

Fetching transformed assets is done by adding a `key` query parameter to the original file's URL. In the management interface, you can configure different asset presets that control the output of any given image. If a requested transformed asset doesn't yet exist, it is dynamically generated and immediately returned.

