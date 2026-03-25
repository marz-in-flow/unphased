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
