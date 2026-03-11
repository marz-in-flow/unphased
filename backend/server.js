require("dotenv").config();

const express = require("express");

const { getDailyGuidance, getEffortLevels } = require("./utils/cycleUtils");

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "unphased-backend" });
});

app.get("/today", async (req, res) => {
  try {
    const profileResult = await pool.query(
      "SELECT * FROM cycle_profiles ORDER BY id DESC LIMIT 1"
    );
    
    const cycleStartDate = profileResult.rows[0].cycle_start_date;
    const cycleLengthDays = profileResult.rows[0].cycle_length_days;
    const dailyGuidance = getDailyGuidance(cycleStartDate, cycleLengthDays);
    
    const phase = dailyGuidance.phase;
    const effortLevels = getEffortLevels(dailyGuidance.mode);
    
    const suggestionsResult = await pool.query(`
      SELECT id, title, effort_level, phase_tag 
      FROM suggestions 
      WHERE effort_level = ANY($1)
      AND (phase_tag = $2 OR phase_tag IS NULL)
      ORDER BY id ASC LIMIT 5
    `,
    [effortLevels, phase]
  );

    res.json({
      day: dailyGuidance.day,
      phase: dailyGuidance.phase,
      mode: dailyGuidance.mode,
      cycle_profile: profileResult.rows[0] ?? null,
      suggestions: suggestionsResult.rows,
    }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/db-test", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/cycle-profile", async (req, res) => {
  const { cycle_start_date, cycle_length_days, period_length_days } = req.body;

  if (!cycle_start_date || !cycle_length_days) {
    return res.status(400).json({
      error: "cycle_start_date and cycle_length_days are required",
    });
  }

  try {
    const query = `INSERT INTO cycle_profiles (cycle_start_date, cycle_length_days, period_length_days) 
    VALUES ($1, $2, $3) RETURNING *`;
    const values = [cycle_start_date, cycle_length_days, period_length_days];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Cycle profile saved.",
      data: result.rows[0],
    }); 
} catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});