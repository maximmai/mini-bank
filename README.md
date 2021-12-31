# Introduction

Mini-Bank was built from the ground-up with a JSON API that makes it easy for developers to study and exercise the implementations of a banking application.

These docs describe how to use the [Mini-bank](https://mini-bank.maximmai.fastdns.io) API. We hope you enjoy these docs, and please don't hesitate to [file an issue](https://github.com/maximmai/mini-bank/issues/new) if you see anything missing.

## Use Cases

There are many reasons to use the Mini-Bank repository. The most common use case is to modify the base APIs in `account` and `invoice` and extend their functionalities to implement more real world related problems in a bank.

However, the based application may lack of basic features, feel free to file an issue and submit a PR to enhance the base of mini-bank.

## Prerequisite
- MySQL, PostgreSQL or any *\*SQL* compatible databases
- Node v14+

## Database initialization
Once a database is provisioned, run the following script to create the base tables, https://github.com/maximmai/mini-bank/blob/main/database/mini_bank.sql

## Environment
Create a `.env` file that contains the database connection information:

```bash
USERDB='mini_bank'
PASSWORD='password'
HOST='localhost'
DATABASE='mini_bank'
```

## Building and running the application
```bash
npm install
npm start
```

## Requests

### Example 

```http
GET /api/<resource>/<id>
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `resource` | `string` | **Required**. Possible value: `account`, `invoice` |
| `id` | `string` | **Required**. Resource id |

## Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, Mini-bank returns a JSON response in the following format:

```javascript
{
  "message" : string,
  "success" : bool,
  "data"    : JSON
}
```

The `message` attribute contains a message commonly used to indicate errors or, in the case of deleting a resource, success that the resource was properly deleted.

The `success` attribute describes if the transaction was successful or not.

The `data` attribute contains any other metadata associated with the response. This will be an JSON data.

## Status Codes

Mini-bank returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |


## Account
### Create an account 
```http
POST /api/account
```
#### Query
N/A

#### Payload
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | **Required**. The name of the holder of the account |

```JSON
{
    "name": "John Doe"
}
```

### Retrieve an account
```http
GET /api/account/:id
```
#### Query
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id`  | `string`  | **Required**. The unique id of the account |


### Make a deposit
```http
POST /api/account/:id/deposit
```
#### Query
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id`  | `string`  | **Required**. The unique id of the account |

#### Payload
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `amount` | `integer` | **Required**. The amount to deposit |

```JSON
{
    "amount": 2000
}
```

### Withdraw from an account
```http
POST /api/account/:id/withdraw
```
#### Query
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id`  | `string`  | **Required**. The unique id of the account |

#### Payload
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `amount` | `integer` | **Required**. The amount to withdraw |

```JSON
{
    "amount": 500
}
```

### Make a transfer to another account
```http
POST /api/account/transfer
```
#### Query
N/A

#### Payload
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `sourceAccountId` | `string` | **Required**. The account id of the source account |
| `destAccountId` | `string` | **Required**. The account id of the destination account |
| `amount` | `integer` | **Required**. The amount to transfer |

```JSON
{
    "sourceAccountId": 1,
    "destAccountId": 2,
    "amount": 300
}
```

## Invoice
### Create an invoice
```http
POST /api/invoice/create
```
#### Query
N/A

#### Payload
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `recipientAccountId` | `string` | **Required**. The id of the recipient's account |
| `amount` | `integer` | **Required**. The amount due |

```JSON
{
    "recipientAccountId": 1,
    "amount": 50
}
```


### Make a payment to an invoice
`app.post('/invoice/:id/pay');`
```http
POST /api/invoice/:id/pay
```
#### Query
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id`  | `string`  | **Required**. The unique id of the unpaid invoice |

#### Payload
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `payerAccountId` | `string` | **Required**. The id of the payer's account |

```JSON
{
    "payerAccountId": 2
}
```

### Retrieve an invoice
```http
GET /api/invoice/:id
```

#### Query
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id`  | `string`  | **Required**. The unique id of the invoice |

