import axios from "axios";

const URL = "https://data4seo-mcp-dev2055-571d0008.koyeb.app/mcp";

async function testToolCall() {
  console.log("Testing DataForSeo MCP Tool Call (with polling)...");

  try {
    // 1. Initialize
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
        },
      }
    );

    const sessionId = initResponse.headers["mcp-session-id"];
    if (!sessionId) throw new Error("No mcp-session-id");

    // 2. Call google_play_app_info
    console.log("\n2. Calling 'google_play_app_info' for 'com.chime'...");
    const callResponse = await axios.post(
      URL,
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "google_play_app_info",
          arguments: {
            app_id: "com.chime"
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "mcp-session-id": sessionId,
        },
      }
    );

    console.log("Response Body Sample:", callResponse.data.substring(0, 1000));
    
    if (callResponse.data.includes("com.chime") && !callResponse.data.includes("\"result\": null")) {
      console.log("\n✅ SUCCESS: Received actual data for 'com.chime'!");
    } else if (callResponse.data.includes("20100")) {
      console.log("\n❌ FAILURE: Still received async task ID (20100). Polling failed or timed out.");
    } else {
      console.log("\n❓ UNKNOWN STATE: Check response body.");
    }

  } catch (error: any) {
    console.error("\n❌ TEST FAILED:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testToolCall();
