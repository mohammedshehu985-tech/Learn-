import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Simple Backend API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online", 
      message: "LearnHub Ghana Backend is fully operational",
      timestamp: new Date().toISOString(),
      supabaseConnected: !!supabaseUrl
    });
  });

  // Supabase Data Example
  app.get("/api/data", async (req, res) => {
    try {
      // Example: fetching from a hypothetical 'courses' table in Supabase
      const { data, error } = await supabase.from('courses').select('*').limit(5);
      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Example Protected Backend Check (Optional)
  app.get("/api/admin-check", (req, res) => {
    // In a real app, you'd check a session or token here
    res.json({ authorized: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
  });
}

startServer();
