/**
 * server.js — Express backend for unPhased.
 * Handles routing, database queries, and response formatting.
 * Business logic (phase calculation, mode mapping) is delegated to cycleUtils.js.
 */

// ---------- Environment variables ----------
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// ---------- Imports ----------
const express = require("express");
const session = require("express-session")
const bcrypt = require("bcrypt");
const path = require("path");
const { Pool } = require("pg");
const { getDailyGuidance, getEffortLevels } = require("./utils/cycleUtils");
const { config } = require("dotenv");


// ---------- App and database setup ----------
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const frontendPath = path.join(__dirname, "../frontend");

// ---------- Middleware ----------
app.use(express.static(frontendPath));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// ---------- Routes ----------
/**
 * GET /health — Confirms server is running.
 * @returns {Object} { status, service }
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "unphased-backend" });
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

app.post("/register", async(req, res) => {
  const { email, password } = req.body;
  const errors = [];
  
  if (!email || !password) errors.push("Email and password are required");
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (errors.length > 0 ) return res.status(400).json({ errors });

  const normalizedEmail = email.trim().toLowerCase();
  const checkEmailQuery = `
    SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)
    `;

  try {
    const result = await pool.query(checkEmailQuery, [normalizedEmail]);
    const emailExists = result.rows[0].exists;

    if(emailExists) return res.status(409).json({ error: "An account with that email already exists"});

    const hash = await bcrypt.hash(password, 10);
    
    const insertUserQuery = `
      INSERT INTO users(email, password_hash)
      VALUES ($1, $2)
    `;
    
    await pool.query(insertUserQuery, [normalizedEmail, hash]);

    res.status(201).json({
      message: "Account created successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/login", async(req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const normalizedEmail = email.trim().toLowerCase();
  try {
    const loginQuery = `
      SELECT id, password_hash FROM users WHERE email = $1
      `;
    const result = await pool.query(loginQuery, [normalizedEmail]);
    const user = result.rows[0];
    
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    
    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
      }
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Something went wrong" });
        }
        res.status(200).json({ message: "Logged in" });
      });
    });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({error: "Something went wrong"});
    }
    res.clearCookie("connect.sid");
    res.status(200).json({message: "Logged out"});
  })
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
  const { cycleStartDate, cycleLengthDays, periodLengthDays } = req.body;

  if (!cycleStartDate || cycleLengthDays === undefined) {
    return res.status(400).json({
      error: "cycleStartDate and cycleLengthDays are required",
    });
  }

  const cycleLength = Number(cycleLengthDays);

  if (!Number.isInteger(cycleLength)) {
    return res.status(400).json({
      error: "cycleLengthDays must be a whole number",
    });
  }

  if (cycleLength < 21 || cycleLength > 40) {
    return res.status(400).json({
      error: "cycleLengthDays must be between 21 and 40",
    });
  }

  const parsedDate = new Date(cycleStartDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      error: "cycleStartDate must be a valid date",
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsedDate.setHours(0, 0, 0, 0);

  if (parsedDate > today) {
    return res.status(400).json({
      error: "cycleStartDate cannot be in the future",
    });
  }

  try {
    const query = `
      INSERT INTO cycle_profiles (cycle_start_date, cycle_length_days, period_length_days)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [cycleStartDate, cycleLength, periodLengthDays ?? null];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Cycle profile saved.",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /daily-guidance — Returns daily guidance and filtered suggestions.
 * Fetches most recent cycle profile, computes phase/mode,
 * then filters suggestions by effort level AND phase tag.
 * @returns {Object} { day, phase, mode, cycle_profile, suggestions[] }
 */

app.get("/daily-guidance", async (req, res) => {
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
    const mode = dailyGuidance.mode;
    
    let allowedEffortLevels = getEffortLevels(mode);

    //adjusts allowed effort levels based on low energy toggle
    if (req.query.low_energy === "true") {
      allowedEffortLevels = ["low"];
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayKey = String(today.getTime());

    // ANY($1) checks effort_level against the allowedEffortLevels array.
    // Both conditions must be met: effort matches mode AND phase matches or is NULL
    const suggestionsResult = await pool.query(
      `
      SELECT id, title, description, effort_level, phase_tag, category
      FROM suggestions
      WHERE effort_level = ANY($1)
        AND (phase_tag = $2 OR phase_tag IS NULL)
      ORDER BY md5($3 || id::text)
    `,
    [allowedEffortLevels, phase, todayKey]
  );

    res.json({
      day: dailyGuidance.day,
      phase: dailyGuidance.phase,
      mode: dailyGuidance.mode,
      cycle_profile: profileResult.rows[0],
      suggestions: suggestionsResult.rows,
    }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Server start ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});