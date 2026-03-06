function getCycleDay(cycleStartDate) {
    const start = new Date(cycleStartDate);
    const today = new Date();
    const diffMs = today - start;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays + 1;
}

function getCyclePhase(cycleDay, cycleLengthDays) { 
    const menstrualEnd = Math.round(cycleLengthDays * 0.18); 
    const follicularEnd = Math.round(menstrualEnd + (cycleLengthDays* 0.28)); 
    const ovulatoryEnd = Math.round(follicularEnd + (cycleLengthDays*.10)); 
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