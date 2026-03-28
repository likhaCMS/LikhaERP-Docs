# Upload Files

Learn to upload files via both the management interface (Data Studio) and the API. Multiple files can be uploaded simultaneously. File uploads are not limited to just images; they can be any kind of file.

## Data Studio

By opening the files module on the left, you will see your file library, which acts as one big folder to store all uploaded files and sub-folders.

Create a folder called `Images` and click the upload button.

You'll see a popup with options for uploading your file:

- Dragging a file from your desktop.
- Clicking on the popup area to select a file from your machine.
- Clicking on the menu in the popup and selecting "Import from URL"

Optionally, you can also click the file display to open the file details page and fill in information as desired.

## API

Multiple files can be uploaded via the API using a `multipart/form-data` request. The file contents must be provided in a property called `file`. All other properties of the file object can be provided as well, except `filename_disk` and `filename_download`.

**Endpoint:** `POST /files`

**Example Request:**

```http
POST /api/files HTTP/1.1
Host: your-domain.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data; boundary=----boundary

------boundary
Content-Disposition: form-data; name="file_1_property"; value="Value"
------boundary
Content-Disposition: form-data; name="file"; filename="image1.jpg"
Content-Type: image/jpeg

<binary data>
------boundary
Content-Disposition: form-data; name="file_2_property"; value="Value"
------boundary
Content-Disposition: form-data; name="file"; filename="image2.png"
Content-Type: image/png

<binary data>
------boundary--
```

The response will include the created file items with their IDs and metadata.

## Import a File from URL

In the files module, click the upload button and select the URL import option to import a file via URL.

Use the file URL and it will be uploaded to your asset storage.

