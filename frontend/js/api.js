const API_BASE_URL = "";
export let todayPickedIds = [];

export async function postCycleProfile(cycleProfile) {
  const response = await fetch(`${API_BASE_URL}/cycle-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cycleProfile),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save cycle profile.");
  }

  return response.json();
}

let cachedDefault = null;
let cachedLowEnergy = null;
let cacheDate = null;

export async function fetchDailyGuidance(lowEnergy = false) {
  const today = new Date().toISOString().slice(0,10);

  if(cacheDate !== today) {
    cachedDefault = null;
    cachedLowEnergy = null;
    cacheDate = today;
  }

  if (lowEnergy && cachedLowEnergy) return cachedLowEnergy;
  if(!lowEnergy && cachedDefault) return cachedDefault;
  
  const url = lowEnergy 
    ? `${API_BASE_URL}/today?low_energy=true`
    : `${API_BASE_URL}/today`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve daily guidance.");
  }

  const data = await response.json();

  if (lowEnergy) {
    cachedLowEnergy = data;
  } else {
    cachedDefault = data;
  }

  return data;
}

export function setLowEnergy(active) {
  localStorage.setItem("lowEnergy", JSON.stringify({
    active,
    date: new Date().toISOString().slice(0, 10)
  }));
}

export function isLowEnergy() {
  const stored = localStorage.getItem("lowEnergy");
  if (!stored) return false;

  const { active, date } = JSON.parse(stored);
  const today = new Date().toISOString().slice(0, 10);

  if (date !== today) {
    localStorage.removeItem("lowEnergy");
    return false;
  }

  return active;
}