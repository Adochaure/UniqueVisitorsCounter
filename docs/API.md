# API

The server exposes the health route plus the visitor endpoints below. Visitor endpoints require a configured PostgreSQL database.

## `POST /v1/visitors`

Request:

```json
{ "siteId": "my-portfolio", "visitorId": "00000000-0000-4000-8000-000000000000" }
```

Response:

```json
{ "count": 42 }
```

The server accepts an anonymous visitor identifier created and retained by the browser SDK, and returns the site's aggregate count. No IP tracking or browser fingerprinting is used.

## `GET /v1/visitors/:siteId/count`

Response:

```json
{ "count": 42 }
```
