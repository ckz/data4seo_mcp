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
2.  **Polls** the retrieval endpoint every 3-5 seconds.
3.  **Waits** until completion or timeout.

**Timeouts by Tool Type:**
- **App Info & Search:** Typically completes in 10-30 seconds.
- **App Reviews:** Can take up to **3 minutes** (180s) due to the depth of data.

**Tip:** If a review call takes a long time, it is likely still polling. Be patient.

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
    -   **Sort (App Store):** Use `"most_relevant"` (default) or `"newest"`.
    -   **Sort (Google Play):** Use `"helpful"` or `"newest"`.

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
- **Avoid** calling many review tools in parallel if you need the data sequentially, as each call can take up to 3 minutes.
