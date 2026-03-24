export function renderOnboarding() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <section class="onboarding-screen">
        <header class="onboarding-header">
           <img
            src="images/unphased-logo-v1.png"
            alt="Unphased logo"
            class="onboarding-logo"
          />
          <p>Daily Direction, Powered by Your Biology</p>
        </header>
        
        <h2>Set up your cycle</h2>
        <p>Enter a few details to personalize your daily guidance.</p>
          
        <form id="onboarding-form">
          <label for="cycle-start-date">Last period start date</label>
          <input 
            type="date"
            id="cycle-start-date"
            name="cycleStartDate"
            required
            />

          <label for="cycle-length">Average cycle length (days)</label>
          <input 
            type="number" 
            id="cycle-length" 
            name="cycleLengthDays"
            min="21"
            max="40"
            required
          />
          
            <p id="onboarding-error"></p>
            
            <button type="submit">get unPhased :)</button>
          </form>
        

        <p class="disclaimer">
          <em>Unphased is not medical advice and should not replace professional care.</em>
        </p>
      </section>
  `;
  const form = document.getElementById("onboarding-form");
  const error = document.getElementById("onboarding-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const cycleStartDate = formData.get("cycleStartDate");
    const cycleLengthRaw = formData.get("cycleLengthDays");

     if (!cycleStartDate || !cycleLengthRaw) {
      error.textContent = "Please fill out all fields.";
      return;
     }
    
     const cycleLengthDays = Number(cycleLengthRaw);
    const today = new Date().toISOString().split("T")[0];

    if (cycleStartDate > today) {
      error.textContent = "Start date cannot be in the future.";
      return;
    }

    error.textContent = "";
    
    const cycleProfile = {
      cycleStartDate,
      cycleLengthDays,
    };

    localStorage.setItem("cycleProfile", JSON.stringify(cycleProfile));

     console.log("Saved profile:", cycleProfile);
  });

}
 