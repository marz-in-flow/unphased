import { fetchCycleLogs, postCycleLog, updateCycleLog, deleteCycleLog } from "../api.js";

export async function renderTracker(onBack) {
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
      <div id="period-logs"></div>
    </section>
  `;

  const form = document.getElementById("period-log-form");
  const errorDisplay = document.getElementById("tracker-error");
  const logsList = document.getElementById("period-logs");
  document.getElementById("back-btn").addEventListener("click", () => {
    onBack();
  });

  form.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorDisplay.textContent = "";

  const formData = new FormData(form);
  const periodStartDate = formData.get("periodStartDate");
  const notes = formData.get("notes");
  console.log({ periodStartDate, notes });

  try {
    await postCycleLog({ periodStartDate, notes });

    form.reset();

    await loadCycleLogs(logsList);
  } catch (err) {
    errorDisplay.textContent = err.message;
    console.error(err);
  }
});

  loadCycleLogs(logsList);
}

async function loadCycleLogs(logsList) {
  logsList.innerHTML = "<p>Loading period logs...</p>";

  try {
    const data = await fetchCycleLogs();
    const logs = data.data;

    renderCycleLogs(logsList, logs);
  } catch (err) {
    logsList.innerHTML = "<p>Could not load period logs.</p>";
    console.error(err);
  }
}

function renderCycleLogs(container, logs) {
  container.innerHTML = "";

  if (!logs || logs.length === 0) {
    container.innerHTML = "<p>No period logs yet.</p>";
    return;
  }

  logs.forEach((log) => {
    const entry = document.createElement("div");
    entry.classList.add("period-entry");
    entry.dataset.logId = log.id;

    const dateHeading = document.createElement("h4");
    dateHeading.textContent = formatDateOnly(log.period_start_date);

    const notesText = document.createElement("p");
    notesText.textContent = log.notes || "No notes";

    const actions = document.createElement("div");
    actions.classList.add("period-entry-actions");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    entry.append(dateHeading, notesText, actions);
    container.appendChild(entry);
  });
}

function formatDateOnly(dateValue) {
  const dateString = dateValue.slice(0, 10);
  const [year, month, day] = dateString.split("-");

  return `${month}/${day}/${year}`;
}

