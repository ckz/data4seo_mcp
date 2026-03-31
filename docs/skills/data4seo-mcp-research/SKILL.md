---
name: data4seo-mcp-research
description: App store research and competitive analysis using DataForSeo MCP. Use when analyzing Google Play or App Store rankings, metadata, reviews, or searching for apps by keyword.
---

# DataForSeo MCP Research

## Overview

This skill provides procedural knowledge for using the DataForSeo MCP server to conduct deep research on mobile applications across Google Play and the Apple App Store.

**Announce at start:** "I'm using the data4seo-mcp-research skill to help with your app store research request."

## Key Concepts

### 1. Polling Behavior (Critical)
The DataForSeo API is asynchronous. When a tool is called, the MCP server performs the following:
1.  **POST**s a task to DataForSeo.
2.  **Polls** the retrieval endpoint every 5 seconds.
3.  **Waits** until the task is complete (usually 10-30 seconds).

**Tip:** Be patient when calling tools; they will "hang" while waiting for the actual data.

### 2. App ID Formats
- **Google Play:** Always use the package name (e.g., `com.chime.android`, `com.whatsapp`).
- **App Store:** Always use the numeric ID (e.g., `284812244`).

## Workflows

### Workflow 1: Market Keyword Search
To find which apps are dominating a specific niche:
1.  **Search:** Use `google_play_app_searches` or `app_store_app_searches` with a `keyword`.
2.  **Depth:** Set `depth` (up to 100) to get a broader list.
3.  **Analyze:** Examine the `result` array for ranking positions.

### Workflow 2: Deep App Analysis
To audit a specific competitor:
1.  **Metadata:** Call `google_play_app_info` or `app_store_app_info` to get titles, descriptions, and developer info.
2.  **Reviews:** Use `google_play_app_reviews` or `app_store_app_reviews`.
    -   Use `sort_by: "newest"` for current sentiment.
    -   Use `sort_by: "most_relevant"` (App Store) or `"helpful"` (Google Play) for high-impact feedback.

### Workflow 3: Category Discovery
To see top charts:
1.  **Collections:** Use `app_collection` parameters.
    -   Google: `topselling_free`, `topselling_paid`, `topgrossing`.
    -   Apple: `topfreeapplications`, `topgrossingapplications`.
2.  **Categories:** Use `category_id` (e.g., `6014` for Finance on App Store, `FINANCE` on Google Play).

## Common Parameter Values

| Market | `location_name` | `language_name` | `location_code` |
| :--- | :--- | :--- | :--- |
| **US** | United States | English | 2840 |
| **UK** | United Kingdom | English | 2826 |
| **Germany** | Germany | German | 2276 |

## Red Flags

- **Never** use numeric IDs for Google Play tools (results in 404).
- **Never** use package names for App Store tools.
- **Avoid** calling many tools in parallel if you need the data sequentially, as each call takes ~20s.
