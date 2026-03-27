import { fetchDailyGuidance, isLowEnergy, todayPickedIds } from "./api.js";
import { phaseBlurbs } from './phaseBlurbs.js';

export async function renderBody() {
  try {
    const lowEnergy = isLowEnergy();
    const data = await fetchDailyGuidance(lowEnergy);
    const blurb = phaseBlurbs.body[data.phase];

    const moveSuggestions = data.suggestions.filter(
      s => s.category === 'move' && !todayPickedIds.includes(s.id));
    const nourishSuggestions = data.suggestions.filter(
      s => s.category === 'nourish' && !todayPickedIds.includes(s.id));
    
    const content = document.getElementById("content");
    content.innerHTML = `
      <header id="body-header">
        <h2 id="body-heading">Body</h2>
        <p>Day ${data.day} - ${data.phase}</p>
      </header>
      <p class="phase-blurb">${blurb}</p>
      <section id="nourish-section">
        <h3 id=nourish-heading>Nourish</h3>
        ${nourishSuggestions.slice(0, 2).map(s => `
          <div class="suggestion">
            <strong>${s.title}</strong>
            <p>${s.description}</p>
          </div>
        `).join('')}
      </section>

      <section id="move-section">
        <h3 id="move-heading">Move</h3>
        ${moveSuggestions.slice(0, 2).map(s => `
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