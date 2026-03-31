#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express, { Request, Response, NextFunction } from "express";
import { createClient } from "./client.js";
import { registerTools as registerAppTools } from "./tools/app.js";

function parseCredentials(): { login?: string; password?: string } {
  const credentials: { login?: string; password?: string } = {
    login: process.env.DATAFORSEO_LOGIN,
    password: process.env.DATAFORSEO_PASSWORD,
  };

  const args = process.argv.slice(2);
  const loginIdx = args.indexOf("--login");
  if (loginIdx !== -1 && args[loginIdx + 1]) {
    credentials.login = args[loginIdx + 1];
  }
  const passwordIdx = args.indexOf("--password");
  if (passwordIdx !== -1 && args[passwordIdx + 1]) {
    credentials.password = args[passwordIdx + 1];
  }

  return credentials;
}

function createServerWithClient(client: ReturnType<typeof createClient>): McpServer {
  const server = new McpServer({
    name: "data4seo-mcp",
    version: "1.0.0",
  });

  registerAppTools(server, client);

  return server;
}

async function main() {
  const { login, password } = parseCredentials();

  if (process.env.HTTP_MODE === "true") {
    await startHttpServer();
  } else {
    if (!login || !password) {
      console.error("DataForSeo login and password required. Set DATAFORSEO_LOGIN/DATAFORSEO_PASSWORD env vars or pass --login/--password arguments.");
      process.exit(1);
    }
    const client = createClient(login, password);
    const server = createServerWithClient(client);
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

// Store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

async function startHttpServer() {
  const { login, password } = parseCredentials();
  if (!login || !password) {
    console.error("DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD environment variables are required for HTTP mode.");
    process.exit(1);
  }

  const client = createClient(login, password);
  const app = express();

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Express error:", err);
    res.status(500).json({ error: err.message });
  });

  app.use(express.json({ strict: true }));

  app.post("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId && transports[sessionId]) {
      // Existing session - reuse transport
      await transports[sessionId].handleRequest(req, res, req.body);
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New session
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
        onsessioninitialized: (sid) => {
          transports[sid] = transport;
        }
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid) delete transports[sid];
      };

      const server = createServerWithClient(client);
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } else {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid session or request."
      });
    }
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "data4seo-mcp" });
  });

  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DataForSeo MCP server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
