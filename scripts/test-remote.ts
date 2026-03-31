import axios from "axios";

const URL = "https://data4seo-mcp-dev2055-571d0008.koyeb.app/mcp";

async function testRemote() {
  console.log("Testing DataForSeo MCP at:", URL);

  try {
    // 1. Initialize
    console.log("\n1. Sending 'initialize' request...");
    const initResponse = await axios.post(
      URL,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "X-API-Key": "7042f516ffc468f6be9d1b02ba9ff73b"
        },
      }
    );

    const sessionId = initResponse.headers["mcp-session-id"];
    console.log("Session ID:", sessionId);
    
    // The response is in SSE format in the body
    console.log("Initialize Response Body Sample:", initResponse.data.substring(0, 200), "...");

    if (!sessionId) {
      throw new Error("No mcp-session-id received");
    }

    // 2. List Tools
    console.log("\n2. Sending 'tools/list' request...");
    const listResponse = await axios.post(
      URL,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "mcp-session-id": sessionId,
          "X-API-Key": "7042f516ffc468f6be9d1b02ba9ff73b"
        },
      }
    );

    console.log("List Tools Response Body Sample:", listResponse.data.substring(0, 500), "...");
    
    if (listResponse.data.includes("google_play_app_info")) {
      console.log("\n✅ SUCCESS: Found 'google_play_app_info' tool in the list!");
    } else {
      console.log("\n❌ FAILURE: Could not find expected tools in the list.");
    }

  } catch (error: any) {
    console.error("\n❌ TEST FAILED:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testRemote();
