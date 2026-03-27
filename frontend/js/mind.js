import { fetchDailyGuidance, isLowEnergy, todayPickedIds } from "./api.js";
import { phaseBlurbs } from './phaseBlurbs.js';

export async function renderMind() {
  try {
    const lowEnergy = isLowEnergy();
    const data = await fetchDailyGuidance(lowEnergy);
    const blurb = phaseBlurbs.mind[data.phase];

    const mindSuggestions = data.suggestions.filter(
      s => s.category === 'mind' && !todayPickedIds.includes(s.id));

    const content = document.getElementById("content");
    content.innerHTML = `
      <header id="mind-header">
        <h2 id="mind-heading"> Mind </h2>
        <p>Day ${data.day} - ${data.phase}</p>
      </header>
      <p class="phase-blurb">${blurb}</p>
      ${mindSuggestions.slice(0, 2).map(s => `
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