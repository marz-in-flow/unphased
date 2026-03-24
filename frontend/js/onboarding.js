const API_BASE_URL = "http://localhost:3000";

export function renderOnboarding(onComplete) {
  const content = document.getElementById("content");

  content.innerHTML = `
    <section class="onboarding-screen">
      <header class="onboarding-header">
        <img
          src="images/unphased-logo-v1.png"
          alt="unPhased logo"
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

        <button type="submit">Get unPhased</button>
      </form>

      <p class="disclaimer">
        <em>unPhased is not medical advice and should not replace professional care.</em>
      </p>
    </section>
  `;

  const form = document.getElementById("onboarding-form");
  const error = document.getElementById("onboarding-error");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const cycleStartDate = formData.get("cycleStartDate");
    const cycleLengthRaw = formData.get("cycleLengthDays");

    if (!cycleStartDate || !cycleLengthRaw) {
      error.textContent = "Please fill out all fields.";
      return;
    }

    const cycleLengthDays = Number(cycleLengthRaw);

    if (!Number.isInteger(cycleLengthDays)) {
      error.textContent = "Cycle length must be a whole number.";
      return;
    }

    if (cycleLengthDays < 21 || cycleLengthDays > 40) {
      error.textContent = "Cycle length must be between 21 and 40 days.";
      return;
    }

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

    try {
      const response = await fetch(`${API_BASE_URL}/cycle-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cycleProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save cycle profile.");
      }

      const savedProfile = await response.json();

      localStorage.setItem("cycleProfile", JSON.stringify(savedProfile.data));

      if (onComplete) {
        onComplete();
      }
      console.log("Saved profile:", savedProfile);

    } catch (errorObj) {
      error.textContent = errorObj.message;
      console.error(errorObj);
    }
  });
}