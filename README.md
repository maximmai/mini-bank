# Introduction

Mini-Bank was built from the ground-up with a JSON API that makes it easy for developers to study and exercise the implementations of a banking application.

These docs describe how to use the [Mini-bank](https://mini-bank.maximmai.fastdns.io) API. We hope you enjoy these docs, and please don't hesitate to [file an issue](https://github.com/maximmai/mini-bank/issues/new) if you see anything missing.

## Use Cases

There are many reasons to use the Mini-Bank repository. The most common use case is to modify the base APIs in `account` and `invoice` and extend their functionalities to implement more real world related problems in a bank.

However, the based application may lack of basic features, feel free to file an issue and submit a PR to enhance the base of mini-bank.

## Authorization

All API requests should require the use of a generated API key (todo). 

```http
GET /api/<resource>/<id>/?api_key=12345678901234567890123456789012
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `resource` | `string` | **Required**. Possible value: `account`, `invoice` |
| `id` | `string` | **Required**. Your Mini-Bank API key |
| `api_key` | `string` | **Required**. Your Mini-Bank API key |

## Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, Mini-bank returns a JSON response in the following format:

```javascript
{
  "message" : string,
  "success" : bool,
  "data"    : string
}
```

The `message` attribute contains a message commonly used to indicate errors or, in the case of deleting a resource, success that the resource was properly deleted.

The `success` attribute describes if the transaction was successful or not.

The `data` attribute contains any other metadata associated with the response. This will be an escaped string containing JSON data.

## Status Codes

Mini-bank returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

