import { fetchDailyGuidance, isLowEnergy, todayPickedIds } from "./api.js";

export async function renderRest() {
  try {
    const lowEnergy = isLowEnergy();
    const data = await fetchDailyGuidance(lowEnergy);

    const restSuggestions = data.suggestions.filter(
      s => s.category === 'rest' && !todayPickedIds.includes(s.id));

    const content = document.getElementById("content");
    content.innerHTML = `
      <header id="rest-header">
        <h2 id="rest-heading"> Rest </h2>
        <p>Day ${data.day} - ${data.phase}</p>
      </header>
      ${restSuggestions.slice(0, 2).map(s => `
        <div class="suggestion">
          <strong>${s.title}</strong>
          <p>${s.description}</p>
        </div>
      `).join('')}      
    `;
  }catch (errorObj) {
      console.error(errorObj);
  }
}