import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Add your API routes here
  // Example:
  // app.get("/api/hello", (req, res) => {
  //   res.json({ message: "Hello World" });
  // });

  const httpServer = createServer(app);
  return httpServer;
}
