import { fetchDailyGuidance } from "./api.js";

export async function renderToday() {
  try {
    const data = await fetchDailyGuidance();
    console.log("Daily guidance data:", data);
    
    const mind = data.suggestions.find(s => s.category === 'mind');
    const body = data.suggestions.find(s => s.category === 'move' || s.category === 'nourish');
    const rest = data.suggestions.find(s => s.category === 'rest');

    const content = document.getElementById("content");
    content.innerHTML = `
      <header>
        <h1>${data.mode}</h1>
        <p>Day ${data.day} - ${data.phase}</p>
      </header>
      
      <section class="today-screen">
        <section id = "energy-input">
          <p>Placeholder for low energy switch</p>
        </section>
        
        <section class = "suggestions">
          ${mind ? `
            <div class="suggestion">
              <span>🧠</span>
              <strong>${mind.title}</strong>
              <p>${mind.description}</p>
            </div>
          ` : ''}
          ${body ? `
            <div class="suggestion">
              <span>🌿</span>
              <strong>${body.title}</strong>
              <p>${body.description}</p>
            </div>
          ` : ''}
          ${rest ? `
            <div class="suggestion">
              <span>🧘</span>
              <strong>${rest.title}</strong>
              <p>${rest.description}</p>
            </div>
          ` : ''}
        </section>
      </section>
    `;
  }catch (errorObj) {
      console.error(errorObj);
  }
}