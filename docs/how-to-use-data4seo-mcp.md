# How to Use DataForSeo MCP

A comprehensive guide to using the DataForSeo MCP (Model Context Protocol) server for App Data analytics.

---

## Overview

The DataForSeo MCP exposes powerful App Data API endpoints as MCP tools, allowing you to research apps, rankings, and reviews on both Google Play and the Apple App Store.

- **App Info** — Detailed metadata for specific applications.
- **App Searches** — Real-time search results for keywords.
- **App List** — Discover top apps by category or collection.
- **App Reviews** — Access user reviews with sorting and depth control.

---

## Setup

### Current Configuration

The DataForSeo MCP is configured as a remote HTTP server:

```json
"data4seo": {
  "type": "http",
  "url": "https://data4seo-mcp-dev2055-571d0008.koyeb.app/mcp",
  "headers": {
    "X-API-Key": "7042f516ffc468f6be9d1b02ba9ff73b"
  }
}
```

Authentication is handled server-side via the `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` environment variables. Client requests must include the `X-API-Key` header.

---

## Available Tools

### 1. App Information

Get detailed metadata including title, description, developer, ratings, and more.

| Tool | Description |
|------|-------------|
| `google_play_app_info` | Get detailed info for a Google Play app (e.g., `com.facebook.katana`). |
| `app_store_app_info` | Get detailed info for an App Store app (e.g., `284812244`). |

**Parameters:**
- `app_id` (required): Package name for Android, numeric ID for iOS.
- `location_name` / `location_code` (optional): Target specific markets (e.g., "United States").
- `language_name` / `language_code` (optional): Target specific languages (e.g., "en").

---

### 2. App Searches

Perform keyword searches to see which apps rank for specific terms.

| Tool | Description |
|------|-------------|
| `google_play_app_searches` | Search results from Google Play. |
| `app_store_app_searches` | Search results from the App Store. |

**Parameters:**
- `keyword` (required): The search term.
- `depth` (optional): Number of results to fetch (max 100).
- `location_*` / `language_*` (optional): Localize the search.

---

### 3. App Lists

Discover top-performing apps across various categories and collections.

| Tool | Description |
|------|-------------|
| `google_play_app_list` | Top apps from Google Play by category/collection. |
| `app_store_app_list` | Top apps from the App Store by category/collection. |

**Parameters:**
- `app_collection` (required): e.g., `topselling_free`, `topfreeapplications`.
- `category_id` (optional): e.g., `BUSINESS`, `6000` (Games).

---

### 4. App Reviews

Analyze user sentiment and feedback.

| Tool | Description |
|------|-------------|
| `google_play_app_reviews` | Fetch reviews for a Google Play app. |
| `app_store_app_reviews` | Fetch reviews for an App Store app. |

**Parameters:**
- `app_id` (required): Target application.
- `sort_by` (optional): e.g., `newest`, `helpful`, `most_helpful`.
- `depth` (optional): Number of reviews to fetch (max 100).

---

## Quick Examples

### Example 1: Search for Apps
Find fitness apps on the App Store in the US:
```
Tool: app_store_app_searches
keyword: "fitness tracker"
location_name: "United States"
depth: 10
```

### Example 2: Get App Details
Check metadata for Instagram on Android:
```
Tool: google_play_app_info
app_id: "com.instagram.android"
```

### Example 3: Analyze Reviews
Read the most helpful reviews for a specific iOS app:
```
Tool: app_store_app_reviews
app_id: "284812244"
sort_by: "most_helpful"
depth: 20
```

---

## Common Parameter Values

### Locations & Languages
- **US English**: `location_name: "United States"`, `language_name: "English"`
- **UK English**: `location_name: "United Kingdom"`, `language_name: "English"`
- **Germany German**: `location_name: "Germany"`, `language_name: "German"`

### App Collections
- **Google Play**: `topselling_free`, `topselling_paid`, `topgrossing`, `movers_shakers`.
- **App Store**: `topfreeapplications`, `toppaidapplications`, `topgrossingapplications`, `topfreeipadapplications`.

---

## Finding App IDs

- **Google Play**: In the URL `id=...` (e.g., `com.whatsapp`).
- **App Store**: The numeric part of the URL (e.g., `id284812244` -> `284812244`).

---

## Support
For more details on the underlying data, visit the [DataForSeo API Documentation](https://dataforseo.com/help-center/app-data-api).
