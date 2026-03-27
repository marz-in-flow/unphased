import { fetchDailyGuidance, isLowEnergy, setLowEnergy, todayPickedIds } from "./api.js";

export async function renderToday() {
  try {
    const lowEnergy = isLowEnergy();
    const data = await fetchDailyGuidance(lowEnergy);

    const mind = data.suggestions.find(s => s.category === 'mind');
    const body = data.suggestions.find(s => s.category === 'move' || s.category === 'nourish');
    const rest = data.suggestions.find(s => s.category === 'rest');

    //Track picked IDs so tabs can exclude them
    todayPickedIds.length = 0;
    if (mind) todayPickedIds.push(mind.id);
    if (body) todayPickedIds.push(body.id);
    if(rest) todayPickedIds.push(rest.id);

    const content = document.getElementById("content");
    content.innerHTML = `
      <header>
        <h1>${data.mode}</h1>
        <p>Day ${data.day} - ${data.phase}</p>
      </header>
      
      <section class="today-screen">
        <section id="energy-input">
          <label for="low-energy-toggle">
            <input type="checkbox" id="low-energy-toggle" ${lowEnergy ? 'checked' : ''} />
            Low energy day?
          </label>
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

  const toggle = document.getElementById("low-energy-toggle");
  console.log("Toggle element:", toggle);

  toggle.addEventListener("change", (e) => {
  console.log("Toggle clicked:", e.target.checked);
  setLowEnergy(e.target.checked);
  renderToday();
  });
  }catch (errorObj) {
      console.error(errorObj);
  }
}