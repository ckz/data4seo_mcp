# DataForSEO App Data API v3 Documentation for MCP

This documentation provides the necessary information to integrate DataForSEO's App Data API (v3) into a Model Context Protocol (MCP) server. It covers both Google Play and Apple App Store endpoints.

---

## 1. General Information

### Base URL
All API requests are sent to:
`https://api.dataforseo.com/v3/`

### Authentication
DataForSEO uses **HTTP Basic Authentication**.
- **Username:** Your API Login
- **Password:** Your API Password

### Standard Workflow
Most endpoints follow the **Standard Method**:
1. **Task POST**: Submit a task and receive a unique `task_id`.
2. **Task GET**: Retrieve the results using the `task_id` once the task is completed (usually within minutes).

---

## 2. Google Play App Data API

### App Searches
Retrieve search results for specific keywords on Google Play.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/google/app_searches/task_post`
*   **Task GET Endpoint:** `https://api.dataforseo.com/v3/app_data/google/app_searches/task_get/advanced/$id`
*   **Key Parameters:**
    *   `keyword` (string): The search query (e.g., "fitness tracker").
    *   `location_code` (integer): Country code (e.g., `2840` for US).
    *   `language_code` (string): Language code (e.g., `en`).
    *   `depth` (integer, optional): Number of results (up to 1000).

### App List
Get top charts or category-specific lists from Google Play.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/google/app_list/task_post`
*   **Key Parameters:**
    *   `app_collection` (string): e.g., `top_free`, `top_paid`, `new_free`, `new_paid`.
    *   `category_id` (string, optional): Filter by category.

### App Info
Detailed metadata for a specific Google Play app.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/google/app_info/task_post`
*   **Key Parameters:**
    *   `app_id` (string): The package name (e.g., `com.whatsapp`).

### App Reviews
Access user reviews and ratings for a Google Play app.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/google/app_reviews/task_post`
*   **Key Parameters:**
    *   `app_id` (string): The package name.
    *   `depth` (integer, optional): Number of reviews to fetch.

### App Listings (Search Live)
Database-driven search using advanced filters. This is a "Live" endpoint.

*   **Endpoint:** `POST https://api.dataforseo.com/v3/business_data/google/app_listings/search/live`
*   **Key Parameters:**
    *   `location_name` or `location_code` (Required).
    *   `language_name` or `language_code` (Required).
    *   `categories` (array, optional): e.g., `["FINANCE", "BUSINESS"]`.
    *   `filters` (array, optional): Advanced filtering.

---

## 3. Apple App Store App Data API

### App Searches
Retrieve search results for specific keywords on the Apple App Store.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/apple/app_searches/task_post`
*   **Task GET Endpoint:** `https://api.dataforseo.com/v3/app_data/apple/app_searches/task_get/advanced/$id`
*   **Key Parameters:**
    *   `keyword` (string): The search query.
    *   `location_code` (integer): Country code.
    *   `language_code` (string): Language code.

### App List
Get top charts or category-specific lists from the App Store.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/apple/app_list/task_post`
*   **Key Parameters:**
    *   `app_collection` (string): e.g., `top_free_ios`, `top_paid_ios`, `top_grossing_ios`.
    *   `category_id` (string, optional): e.g., `6014` for Games.

### App Info
Detailed metadata for a specific iOS application.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/apple/app_info/task_post`
*   **Key Parameters:**
    *   `app_id` (string): The unique Apple ID (e.g., `id123456789`).

### App Reviews
Access user reviews and ratings for an iOS app.

*   **Task POST Endpoint:** `https://api.dataforseo.com/v3/app_data/apple/app_reviews/task_post`
*   **Key Parameters:**
    *   `app_id` (string): The unique Apple ID.

### App Listings (Search Live)
Database-driven search using advanced filters.

*   **Endpoint:** `POST https://api.dataforseo.com/v3/business_data/apple/app_listings/search/live`
*   **Key Parameters:**
    *   `location_name` or `location_code` (Required).
    *   `language_name` or `language_code` (Required).
    *   `filters` (array, optional).

---

## 4. Code Snippets (Node.js Example)

### POST Task Example
```javascript
const axios = require('axios');

const postTask = async () => {
  const credentials = Buffer.from('YOUR_LOGIN:YOUR_PASSWORD').toString('base64');
  const response = await axios.post('https://api.dataforseo.com/v3/app_data/google/app_searches/task_post', [
    {
      "keyword": "meditation",
      "location_code": 2840,
      "language_code": "en",
      "priority": 2
    }
  ], {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(response.data.tasks[0].id); // This is your Task ID
};
```

### GET Results Example
```javascript
const getResults = async (taskId) => {
  const credentials = Buffer.from('YOUR_LOGIN:YOUR_PASSWORD').toString('base64');
  const response = await axios.get(`https://api.dataforseo.com/v3/app_data/google/app_searches/task_get/advanced/${taskId}`, {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });
  console.log(JSON.stringify(response.data, null, 2));
};
```

---

## 5. Reference Tables

### Common App Collections (Apple)
- `top_free_ios`
- `top_paid_ios`
- `top_grossing_ios`
- `top_free_ipad`
- `top_paid_ipad`

### Common App Collections (Google)
- `top_free`
- `top_paid`
- `new_free`
- `new_paid`
- `grossing`

### Finding Codes
- **Locations:** `GET /v3/app_data/google/locations/`
- **Languages:** `GET /v3/app_data/google/languages/`
- **Categories:** `GET /v3/app_data/google/categories/`
