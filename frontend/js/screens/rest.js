import { fetchDailyGuidance, isLowEnergy, todayPickedIds } from "../api.js";
import { phaseBlurbs } from '../phaseBlurbs.js';

export async function renderRest() {
  try {
    const lowEnergy = isLowEnergy();
    const data = await fetchDailyGuidance(lowEnergy);
    document.body.className = `mode-${data.mode.toLowerCase()}`;

    const blurb = phaseBlurbs.rest[data.phase];
    
    const restSuggestions = data.suggestions.filter(
      s => s.category === 'rest' && !todayPickedIds.includes(s.id));

    const content = document.getElementById("content");
    content.innerHTML = `
      <header class="screen-header">
        <h2 class="screen-title">Rest</h2>
        <p class="cycle-info">Day ${data.day} · ${data.phase}</p>
      </header>

      <p class="phase-blurb">${blurb}</p>
      ${restSuggestions.slice(0, 2).map(s => `
        <div class="suggestion-card">
          <h3 class="suggestion-title">${s.title}</h3>
          <p class="suggestion-text">${s.description}</p>
        </div>
      `).join('')}      
    `;
  }catch (errorObj) {
      console.error(errorObj);
  }
}