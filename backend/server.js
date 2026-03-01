const express = require("express");

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});