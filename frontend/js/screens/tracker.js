export async function renderTracker(onComplete) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <header>
      <h1>Period Tracker</h1>
      <button type="button" id="back-btn">Back</button>
    </header>
    
    <form id="period-log-form">
      <label for="period-start-date">Add period</label>
      <input
          type="date"
          id="period-start-date"
          name="periodStartDate"
          required
        />

      <label for="notes"> Notes:</label>
      <textarea 
        id="notes" 
        name="notes" 
        placeholder="Optional" 
        rows="5" 
        cols="33"
      ></textarea>
      
      <p id="tracker-error"></p>

      <button type="submit">Save Period</button>
    </form>
    
    <section>
      <h2>Previous periods</h2>
      <div id="period-logs-list">
        <p>Loading period logs...</p>
      </div>
    </section>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    onComplete();
  });
}
