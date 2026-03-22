/**
 * cycleUtils.js — Core cycle calculation and mode mapping logic based on cycle start date and average cycle length provided by user.
 */

/**
 * Calculates current cycle day. Dates normalized to midnight
 * to prevent timezone off-by-one errors from PostgreSQL.
 * @param {string|Date} cycleStartDate - Start date of last period
 * @returns {number} Current cycle day (1-based)
 */

function getCycleDay(cycleStartDate) {
    const start = new Date(cycleStartDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffMs = today - start;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return Math.round(diffDays + 1);
}

/**
 * Determines cycle phase using proportional scaling so boundaries
 * adapt to different cycle lengths (not hardcoded to 28 days).
 * @param {number} cycleDay - Current cycle day (1-based)
 * @param {number} cycleLengthDays - User's total cycle length
 * @returns {string} "menstrual", "follicular", "ovulatory", or "luteal"
 */
function getCyclePhase(cycleDay, cycleLengthDays) { 
    const menstrualEnd = Math.round(cycleLengthDays * 0.18); 
    const follicularEnd = Math.round(menstrualEnd + (cycleLengthDays * 0.28)); 
    const ovulatoryEnd = Math.round(follicularEnd + (cycleLengthDays *.10)); 
    if (cycleDay <= menstrualEnd) { 
        return "menstrual"; 
    } else if (cycleDay <= follicularEnd) { 
    return "follicular"; 
    } else if (cycleDay <= ovulatoryEnd) { 
        return "ovulatory";
    } else { 
        return "luteal"; 
    } 
} 

/**
 * Maps biological phase to a behavioral guidance mode.
 * @param {string} phase - Cycle phase
 * @returns {string} "Restore", "Build", "Peak", or "Protect"
 */
function getMode(phase) {
    if (phase === "menstrual") { 
        return "Restore"; 
    } else if (phase ==="follicular") { 
        return "Build"; 
    } else if (phase === "ovulatory") { 
        return "Peak"; 
    } else { 
        return "Protect"; 
    } 
} 

/**
 * Returns allowed effort levels for a given mode.
 * Used to filter suggestions to match user's estimated capacity.
 * @param {string} mode - Current daily mode
 * @returns {string[]} Allowed effort levels
 */
function getEffortLevels(mode) {
    if (mode === "Restore") { 
        return ["low"]; 
    } else if (mode ==="Build") { 
        return ["low", "medium"]; 
    } else if (mode === "Peak") { 
        return ["medium", "high"]; 
    } else { 
        return ["low", "medium"] ; 
    } 
}

/**
 * Wrapper function that orchestrates full daily guidance: day → phase → mode.
 * @param {string|Date} cycleStartDay - Start date of last period
 * @param {number} cycleLengthDays - User's total cycle length
 * @returns {Object} { day, phase, mode }
 */
function getDailyGuidance(cycleStartDay, cycleLengthDays) {
    const day = getCycleDay(cycleStartDay);
    const phase = getCyclePhase(day, cycleLengthDays);
    const mode = getMode(phase);

    return {
        day: day,
        phase: phase,
        mode: mode
    };
}

module.exports = { getDailyGuidance, getEffortLevels };