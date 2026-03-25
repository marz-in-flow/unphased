const API_BASE_URL = "http://localhost:3000";

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

export async function fetchDailyGuidance(lowEnergy = false) {
  const url = lowEnergy 
    ? `${API_BASE_URL}/today?low_energy=true`
    : `${API_BASE_URL}/today`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to retrieve daily guidance.");
  }

  return response.json();
}
