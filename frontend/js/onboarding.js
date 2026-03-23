export function renderOnboarding() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <section class="onboarding-screen">
        <header class="onboarding-header">
          <h1>Unphased</h1>
          <p>Personalized cycle-aware daily guidance.</p>
        </header>

        <form id="onboarding-form">
          <label for="cycle-start-date">Last period start date</label>
          <input type="date" id="cycle-start-date" name="cycleStartDate" />

          <label for="cycle-length">Average cycle length (days)</label>
          <input type="number" id="cycle-length" name="cycleLengthDays" />

          <button type="submit">Continue</button>
        </form>

        <p class="disclaimer">
          <em>Unphased is not medical advice and should not replace professional care.</em>
        </p>

      </section>
  `;
}
 