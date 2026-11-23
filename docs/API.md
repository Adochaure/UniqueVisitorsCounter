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

## `GET /v1/visitors/:siteId/growth?days=30`

Returns the lifetime unique visitor total and daily new unique visitors for the selected period. `days` is optional and accepts an integer from 7 to 90 (default: 30). Dates use UTC; dates without new visitors are omitted from the response.

```json
{
  "siteId": "my-portfolio",
  "total": 42,
  "days": 30,
  "daily": [
    { "date": "2026-11-22", "count": 3 },
    { "date": "2026-11-23", "count": 1 }
  ]
}
```

Daily values count each browser ID only on its first visit. They represent new unique visitors, not repeat page visits.
