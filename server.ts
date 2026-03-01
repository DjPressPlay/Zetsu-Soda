import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("shared_cans.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS shared_cans (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    prompt TEXT,
    rarity TEXT,
    icon TEXT,
    imageUrl TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/share", (req, res) => {
    const { name, category, prompt, rarity, icon, imageUrl } = req.body;
    const id = nanoid(10);
    
    try {
      const stmt = db.prepare(`
        INSERT INTO shared_cans (id, name, category, prompt, rarity, icon, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, name, category, prompt, rarity, icon, imageUrl);
      res.json({ id });
    } catch (error) {
      console.error("Error saving shared can:", error);
      res.status(500).json({ error: "Failed to share can" });
    }
  });

  app.get("/api/share/:id", (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare("SELECT * FROM shared_cans WHERE id = ?");
      const can = stmt.get(id);
      if (can) {
        res.json(can);
      } else {
        res.status(404).json({ error: "Can not found" });
      }
    } catch (error) {
      console.error("Error retrieving shared can:", error);
      res.status(500).json({ error: "Failed to retrieve can" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
