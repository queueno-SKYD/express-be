### API Endpoint

* **Endpoint: http://localhost:3001/api/v1/manageDocs/uploadDocument**

cURL Example

```bash
curl --location 'http://localhost:3001/api/v1/manageDocs/uploadDocument' \ --header 'Authorization: YOUR_ACCESS_TOKEN' \ --header 'Content-Type: application/json' \ --data '{   "label": "API documentation sheet 2",   "fileURL": "url" }'
```

> Replace YOUR_ACCESS_TOKEN with the actual access token and provide the necessary details in the request payload.

### Request Payload

* **Method: POST**
* **Headers:
  * **Content-Type: application/json
  * Authorization: Bearer YOUR_ACCESS_TOKEN
* **Body:**

```json
{   "label": "API documentation sheet 2",   "fileURL": "url" }
```

### Response

```json
{     "timeStamp": "Tue Jan 30 2024 22:33:52 GMT+0530 (India Standard Time)",     "httpStatus": "OK",     "statusCode": 200,     "message": "Document uploaded successfully",     "data": {         "fileId": 2,         "ownerId": 21,         "label": null,         "fileURL": "url",         "deleted": 0,         "deleteBy": null,         "createdAt": "2024-01-30T17:03:52.000Z"     } }
```

<hr />

### API Endpoint

* **Endpoint:  http://localhost:3001/api/v1/manageDocs/getDocument**

cURL Example

```bash
curl --location 'http://localhost:3001/api/v1/manageDocs/getDocument' \ --header 'Authorization: YOUR_ACCESS_TOKEN' \ --header 'Content-Type: application/json' \ --data '{     "fileId": 1 }'
```

> Replace YOUR_ACCESS_TOKEN with the actual access token and provide the necessary details in the request payload.

### Request Payload

* **Method: POST**
* **Headers:
  * **Content-Type: application/json
  * Authorization: Bearer YOUR_ACCESS_TOKEN

* **Body:**

```json
{     "fileId": 1 }
```

* Response

```json
{     "timeStamp": "Tue Jan 30 2024 23:45:09 GMT+0530 (India Standard Time)",     "httpStatus": "OK",     "statusCode": 200,     "message": "success",     "data": {         "fileId": 1,         "ownerId": 21,         "label": null,         "fileURL": "url",         "deleted": 0,         "deleteBy": null,         "createdAt": "2024-01-30T17:03:15.000Z"     } }
```

<hr />

### API Endpoint

* **Endpoint: http://localhost:3001/api/v1/manageDocs/getDocuments**

cURL Example

```bash
curl --location 'http://localhost:3001/api/v1/manageDocs/getDocuments' \ --header 'Authorization: YOUR_ACCESS_TOKEN' \ --header 'Content-Type: application/json' \ --data '{     "page": 1,     "pageSize": 10 }'
```

> Replace YOUR_ACCESS_TOKEN with the actual access token and provide the necessary details in the request payload.

### Request Payload

* **Method: POST**
* **Headers:
  * **Content-Type: application/json
  * Authorization: Bearer YOUR_ACCESS_TOKEN
* **Body:**

```json
{     "page": 1,     "pageSize": 10 }
```

* Response

```json
{     "timeStamp": "Tue Jan 30 2024 23:37:20 GMT+0530 (India Standard Time)",     "httpStatus": "OK",     "statusCode": 200,     "message": "Document uploaded successfully",     "data": {         "data": [             {                 "fileId": 1,                 "ownerId": 21,                 "label": null,                 "fileURL": "url2",                 "deleted": 0,                 "deleteBy": null,                 "createdAt": "2024-01-30T17:03:15.000Z"             },             {                 "fileId": 2,                 "ownerId": 21,                 "label": null,                 "fileURL": "url2",                 "deleted": 0,                 "deleteBy": null,                 "createdAt": "2024-01-30T17:03:52.000Z"             }         ],         "page": 1,         "pageSize": 50,         "total": 2     } }
```


### section how to add new API for new table

1. Add model for table in model folder in its named file.moded.ts
2. Add DB query in query folder
   1. Create its named folder and add sql and actual logical query (using class)
3. No go to comtroller and create controller
   1. Controller will import actual query calss and call its method to get your response from database
   2. In every controller add API input params validator (joi)
   3. Middleware will verify token and give you user in res object of controller
4. Now declare path in router/pathName.ts
5. Add controller in router/routs.ts
