require("dotenv").config();

const express = require("express");

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "unphased-backend" });
});

app.get("/today", (req, res) => {
    res.json({
        date: new Date().toISOString().slice(0,10),
        phase: "Unknown (placeholder)",
        mode: "Steady (placeholder)",
        guidance: "Daily direction placeholder (logic + DB coming next).",
        suggestions: [
            { title: "Tidy one small area for 10 minutes", effort: "low" },
            { title: "Prep a simple protein and veggie meal", effort: "medium" },
            { title: "Short walk or light stretch", effort: "low"}
        ]
    });
});

app.get("/db-test", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});