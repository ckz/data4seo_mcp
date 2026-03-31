---
name: using-data4seo-mcp
description: Use when user asks about app store research, app data, keyword searches, competitor analysis on Google Play/App Store, or using the DataForSeo MCP server.
---

# Using DataForSeo MCP

## Overview

The DataForSeo MCP provides essential tools for app store intelligence, research, and competitive analysis across Google Play and the Apple App Store.

**Announce at start:** "I'm using the using-data4seo-mcp skill to help with your app store research request."

## Quick Reference by Task

### App Metadata & Info

| Task | Tool |
|------|------|
| Current Google Play app details | `google_play_app_info` |
| Current App Store app details | `app_store_app_info` |

### Market Research (Search)

| Task | Tool |
|------|------|
| Search for keywords on Google Play | `google_play_app_searches` |
| Search for keywords on the App Store | `app_store_app_searches` |

### Ranking & Discovery

| Task | Tool |
|------|------|
| Top apps by category (Google Play) | `google_play_app_list` |
| Top apps by category (App Store) | `app_store_app_list` |

### Reviews Analysis

| Task | Tool |
|------|------|
| Get reviews for a Google Play app | `google_play_app_reviews` |
| Get reviews for an App Store app | `app_store_app_reviews` |

---

## Common Parameters

| Parameter | Description |
|-----------|-------------|
| `app_id` | Package name (Android) or numeric ID (iOS) |
| `keyword` | Search term |
| `location_name` | Country (e.g., "United States", "United Kingdom") |
| `language_name` | Language (e.g., "English", "German") |
| `depth` | Number of results to fetch (max 100) |
| `sort_by` | sorting reviews (e.g., `newest`, `helpful`, `most_helpful`) |

### App ID Formats

- **Android:** Package name like `com.whatsapp`.
- **iOS:** Numeric ID like `284812244`.

---

## Example Workflows

### Workflow 1: Market Search
1. Search for fitness apps: `google_play_app_searches(keyword: "fitness")`
2. Get details for a top result: `google_play_app_info(app_id: "com.fitbit.FitbitMobile")`
3. Analyze top reviews: `google_play_app_reviews(app_id: "com.fitbit.FitbitMobile", sort_by: "helpful")`

### Workflow 2: Competitor Research
1. Search App Store for terms: `app_store_app_searches(keyword: "meditation")`
2. Get competitor details: `app_store_app_info(app_id: "284812244")`
3. Check top lists in category: `app_store_app_list(app_collection: "topfreeapplications", category_id: "6013")`

---

## Red Flags

- **Never** use numeric IDs for Google Play tools.
- **Never** use package names for App Store tools.
- **Verify** `location_name` if results seem irrelevant (defaults to US).
- **Check** the tool list if a specific category ID is needed.
