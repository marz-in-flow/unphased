/**
 * server.js — Express backend for UnPhased.
 * Handles routing, database queries, and response formatting.
 * Business logic (phase calculation, mode mapping) is delegated to cycleUtils.js.
 */

// Load environment variables from .env before any other code runs.
require("dotenv").config();

const express = require("express");
const { getDailyGuidance, getEffortLevels } = require("./utils/cycleUtils");
const { Pool } = require("pg");

// Connection pool for efficient database query management
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());// Parses incoming JSON request bodies so req.body is usable.

/**
 * GET /health — Confirms server is running.
 * @returns {Object} { status, service }
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "unphased-backend" });
});

/**
 * GET /today — Returns daily guidance and filtered suggestions.
 * Fetches most recent cycle profile, computes phase/mode,
 * then filters suggestions by effort level AND phase tag.
 * @returns {Object} { day, phase, mode, cycle_profile, suggestions[] }
 */
app.get("/today", async (req, res) => {
  try {
    // Fetch the most recent cycle profile (MVP assumes single user)
    const profileResult = await pool.query(
      "SELECT * FROM cycle_profiles ORDER BY id DESC LIMIT 1"
    );

    // Return 404 if no profile exists yet
    if (!profileResult.rows[0]) {
      return res.status(404).json({
        error: "No cycle profile found. Please enter your cycle information."
      });
    }

    const cycleStartDate = profileResult.rows[0].cycle_start_date;
    const cycleLengthDays = profileResult.rows[0].cycle_length_days;
    
    const dailyGuidance = getDailyGuidance(cycleStartDate, cycleLengthDays);
    
    const phase = dailyGuidance.phase;
    
    const effortLevels = getEffortLevels(dailyGuidance.mode);
    
    // ANY($1) checks effort_level against the allowed array.
    // Both conditions must be met: effort matches mode AND phase matches or is NULL
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

/**
 * GET /db-test — Verifies database connectivity with SELECT 1.
 * @returns {Object} { ok: true } or { ok: false, error }
 */
app.get("/db-test", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /cycle-profile — Saves user's cycle configuration.
 * Uses RETURNING * to send inserted row back without a separate SELECT.
 * @param {string} req.body.cycle_start_date - Required
 * @param {number} req.body.cycle_length_days - Required
 * @param {number} [req.body.period_length_days] - Optional
 * @returns {201} { message, data } or {400} if validation fails or {500} if a db error occurs
 */
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

// Use PORT from environment variable (for deployment) or default to 3000 locally
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});