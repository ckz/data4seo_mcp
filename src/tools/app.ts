import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DataForSeoClient } from "../client.js";

export function registerTools(server: McpServer, client: DataForSeoClient) {
  // Google Play App Info
  server.tool(
    "google_play_app_info",
    "Get detailed information about a specific Google Play app",
    {
      app_id: z.string().describe("The ID of the application on Google Play (e.g., com.facebook.katana)"),
      location_name: z.string().optional().describe("Location name (e.g., United States)"),
      location_code: z.number().optional().describe("Location code (e.g., 2840)"),
      language_name: z.string().optional().describe("Language name (e.g., English)"),
      language_code: z.string().optional().describe("Language code (e.g., en)"),
    },
    async ({ app_id, location_name, location_code, language_name, language_code }) => {
      const data = [{
        app_id,
        location_name,
        location_code,
        language_name,
        language_code
      }];
      const result = await client.postAndWait(
        "app_data/google/app_info/task_post",
        "app_data/google/app_info/task_get/advanced",
        data
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // App Store App Info
  server.tool(
    "app_store_app_info",
    "Get detailed information about a specific App Store app",
    {
      app_id: z.string().describe("The ID of the application on App Store (e.g., 284812244)"),
      location_name: z.string().optional().describe("Location name (e.g., United States)"),
      location_code: z.number().optional().describe("Location code (e.g., 2840)"),
      language_name: z.string().optional().describe("Language name (e.g., English)"),
      language_code: z.string().optional().describe("Language code (e.g., en)"),
    },
    async ({ app_id, location_name, location_code, language_name, language_code }) => {
      const data = [{
        app_id,
        location_name,
        location_code,
        language_name,
        language_code
      }];
      const result = await client.postAndWait(
        "app_data/apple/app_info/task_post",
        "app_data/apple/app_info/task_get/advanced",
        data
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Google Play App Searches
  server.tool(
    "google_play_app_searches",
    "Get search results from Google Play",
    {
      keyword: z.string().describe("Keyword to search for"),
      location_name: z.string().optional().describe("Location name"),
      location_code: z.number().optional().describe("Location code"),
      language_name: z.string().optional().describe("Language name"),
      language_code: z.string().optional().describe("Language code"),
      depth: z.number().optional().describe("Search depth (max 100)"),
    },
    async ({ keyword, location_name, location_code, language_name, language_code, depth }) => {
      const data = [{
        keyword,
        location_name,
        location_code,
        language_name,
        language_code,
        depth
      }];
      const result = await client.postAndWait(
        "app_data/google/app_searches/task_post",
        "app_data/google/app_searches/task_get/advanced",
        data
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // App Store App Searches
  server.tool(
    "app_store_app_searches",
    "Get search results from App Store",
    {
      keyword: z.string().describe("Keyword to search for"),
      location_name: z.string().optional().describe("Location name"),
      location_code: z.number().optional().describe("Location code"),
      language_name: z.string().optional().describe("Language name"),
      language_code: z.string().optional().describe("Language code"),
      depth: z.number().optional().describe("Search depth (max 100)"),
    },
    async ({ keyword, location_name, location_code, language_name, language_code, depth }) => {
      const data = [{
        keyword,
        location_name,
        location_code,
        language_name,
        language_code,
        depth
      }];
      const result = await client.postAndWait(
        "app_data/apple/app_searches/task_post",
        "app_data/apple/app_searches/task_get/advanced",
        data
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Google Play App List
  server.tool(
    "google_play_app_list",
    "Get list of apps from Google Play by category",
    {
      app_collection: z.string().describe("Collection of apps (e.g., topselling_free)"),
      category_id: z.string().optional().describe("Category ID (e.g., BUSINESS)"),
      location_name: z.string().optional().describe("Location name"),
      location_code: z.number().optional().describe("Location code"),
      language_name: z.string().optional().describe("Language name"),
      language_code: z.string().optional().describe("Language code"),
    },
    async ({ app_collection, category_id, location_name, location_code, language_name, language_code }) => {
      const data = [{
        app_collection,
        category_id,
        location_name,
        location_code,
        language_name,
        language_code
      }];
      const result = await client.postAndWait(
        "app_data/google/app_list/task_post",
        "app_data/google/app_list/task_get/advanced",
        data
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // App Store App List
  server.tool(
    "app_store_app_list",
    "Get list of apps from App Store by category",
    {
      app_collection: z.string().describe("Collection of apps (e.g., topfreeapplications)"),
      category_id: z.string().optional().describe("Category ID (e.g., 6000)"),
      location_name: z.string().optional().describe("Location name"),
      location_code: z.number().optional().describe("Location code"),
      language_name: z.string().optional().describe("Language name"),
      language_code: z.string().optional().describe("Language code"),
    },
    async ({ app_collection, category_id, location_name, location_code, language_name, language_code }) => {
      const data = [{
        app_collection,
        category_id,
        location_name,
        location_code,
        language_name,
        language_code
      }];
      const result = await client.postAndWait(
        "app_data/apple/app_list/task_post",
        "app_data/apple/app_list/task_get/advanced",
        data,
        60, // 60 retries
        5000 // 5s delay = 300s total
      );

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Google Play App Reviews
  server.tool(
    "google_play_app_reviews",
    "Get reviews for a specific Google Play app",
    {
      app_id: z.string().describe("The ID of the application"),
      location_name: z.string().optional().describe("Location name"),
      location_code: z.number().optional().describe("Location code"),
      language_name: z.string().optional().describe("Language name"),
      language_code: z.string().optional().describe("Language code"),
      depth: z.number().optional().describe("Search depth (max 100)"),
      sort_by: z.string().optional().describe("Sort reviews (e.g., newest, helpful)"),
    },
    async ({ app_id, location_name, location_code, language_name, language_code, depth, sort_by }) => {
      const data = [{
        app_id,
        location_name,
        location_code,
        language_name,
        language_code,
        depth,
        sort_by
      }];
      const result = await client.postAndWait(
        "app_data/google/app_reviews/task_post",
        "app_data/google/app_reviews/task_get/advanced",
        data,
        60, // 60 retries
        5000 // 5s delay = 300s total
      );

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // App Store App Reviews
  server.tool(
    "app_store_app_reviews",
    "Get reviews for a specific App Store app",
    {
      app_id: z.string().describe("The ID of the application"),
      location_name: z.string().optional().describe("Location name"),
      location_code: z.number().optional().describe("Location code"),
      language_name: z.string().optional().describe("Language name"),
      language_code: z.string().optional().describe("Language code"),
      depth: z.number().optional().describe("Search depth (max 100)"),
      sort_by: z.string().optional().describe("Sort reviews (e.g., newest, most_relevant)"),
    },
    async ({ app_id, location_name, location_code, language_name, language_code, depth, sort_by }) => {
      const data = [{
        app_id,
        location_name,
        location_code,
        language_name,
        language_code,
        depth,
        sort_by: sort_by || "most_relevant"
      }];
      const result = await client.postAndWait(
        "app_data/apple/app_reviews/task_post",
        "app_data/apple/app_reviews/task_get/advanced",
        data,
        60, // 60 retries
        5000 // 5s delay = 300s total
      );

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
