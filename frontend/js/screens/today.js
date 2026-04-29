import { fetchDailyGuidance, isLowEnergy, setLowEnergy, todayPickedIds } from "../api.js";

export async function renderToday(onComplete) {
  try {
    const lowEnergy = isLowEnergy();
    const data = await fetchDailyGuidance(lowEnergy);
    document.body.className = `mode-${data.mode.toLowerCase()}`;

    const mind = data.suggestions.find(s => s.category === 'mind');
    const body = data.suggestions.find(s => s.category === 'move' || s.category === 'nourish');
    const rest = data.suggestions.find(s => s.category === 'rest');

    //Track picked IDs so tabs can exclude them
    todayPickedIds.length = 0;
    if (mind) todayPickedIds.push(mind.id);
    if (body) todayPickedIds.push(body.id);
    if(rest) todayPickedIds.push(rest.id);

  const moonIcons = {
    menstrual: '🌑',
    follicular: '🌒',
    ovulatory: '🌕',
    luteal: '🌖'
  };

  const moonIcon = moonIcons[data.phase] || '🌙';

  const content = document.getElementById("content");
  content.innerHTML = `
    <header class="today-header">
      <div class="today-header-text">
        <h1 class="mode-title">
          <span class="today-header-icon">${moonIcon}</span>
          ${data.mode}
        </h1>
        <p class="cycle-info">Day ${data.day} · ${data.phase}</p>
      </div>

      <button type="button" id="logout-btn" class="logout-btn">Log out</button>
    </header>

    <section class="today-screen">
      <section class="energy-toggle">
        <div class="form-check form-switch d-flex align-items-center justify-content-center">
          <input class="form-check-input" type="checkbox" role="switch" id="low-energy-toggle" ${lowEnergy ? 'checked' : ''} />
          <label class="form-check-label" for="low-energy-toggle">Low energy day?</label>
        </div>
      </section>

      
      <section class = "suggestions">
        ${mind ? `
          <div class="suggestion-card">
            <span>🧠</span>
            <h3 class="suggestion-title">${mind.title}</h3>
            <p class="suggestion-text">${mind.description}</p>
          </div>
        ` : ''}
        ${body ? `
          <div class="suggestion-card">
            <span>🌿</span>
            <h3 class="suggestion-title">${body.title}</h3>
            <p class="suggestion-text">${body.description}</p>
          </div>
        ` : ''}
        ${rest ? `
          <div class="suggestion-card">
            <span>🧘</span>
            <h3 class="suggestion-title">${rest.title}</h3>
            <p class ="suggestion-text">${rest.description}</p>
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