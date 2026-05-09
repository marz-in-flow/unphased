const API_BASE_URL = "";

let cachedGuidance = null;
let cachedLowEnergyGuidance = null;
let cacheDate = null;
let onUnauthorized = null;
export let todayPickedIds = [];

export function setOnUnauthorized(callback) {
  onUnauthorized = callback;
}

async function authedFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401 && onUnauthorized) {
    onUnauthorized({ reason: "session_expired" });
  }

  return response;
}

export async function getMe() {
  const response = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to check authentication.");
  }

  return response.json();
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

export async function postLogin({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({ email, password}),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed.");
  }

  return response.json();
}

export async function postRegister({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({ email, password}),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed.");
  }

  return response.json();
}

export async function postLogout() {
  const response = await authedFetch(`${API_BASE_URL}/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Logout failed.");
  }

cachedGuidance = null;
cachedLowEnergyGuidance = null;
todayPickedIds.length = 0;

  return response.json();
}

export async function postCycleProfile(cycleProfile) {
  const response = await authedFetch(`${API_BASE_URL}/cycle-profile`, {
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

export async function fetchDailyGuidance(lowEnergy = false) {
  const today = new Date().toISOString().slice(0,10);

  if(cacheDate !== today) {
    cachedGuidance = null;
    cachedLowEnergyGuidance = null;
    cacheDate = today;
  }

  if (lowEnergy && cachedLowEnergyGuidance) return cachedLowEnergyGuidance;
  if(!lowEnergy && cachedGuidance) return cachedGuidance;
  
  const url = lowEnergy 
    ? `${API_BASE_URL}/daily-guidance?low_energy=true`
    : `${API_BASE_URL}/daily-guidance`;
  
  const response = await authedFetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve daily guidance.");
  }

  const data = await response.json();

  if (lowEnergy) {
    cachedLowEnergyGuidance = data;
  } else {
    cachedGuidance = data;
  }

  return data;
}

export async function fetchCycleLogs() {
  const response = await authedFetch(`${API_BASE_URL}/cycle-logs`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve period logs.");
  }

  const data = await response.json();

  return data;
}

export async function postCycleLog({ periodStartDate, notes }) {
  const response = await authedFetch(`${API_BASE_URL}/cycle-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      periodStartDate,
      notes
   }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save new period.");
  }

  return response.json();
}

export async function updateCycleLog({ id, newPeriodStartDate, newNotes }) {
  const response = await authedFetch(`${API_BASE_URL}/cycle-logs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newPeriodStartDate, 
      newNotes
    }),
  });

   if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to edit period entry.");
  }

  return response.json();
}

export async function deleteCycleLog({ id, newPeriodStartDate, newNotes }) {
  const response = await authedFetch(`${API_BASE_URL}/cycle-logs/${id}`, {
    method: "DELETE",
  });

   if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete period entry.");
  }

  return response.json();
}
