import { fetchCycleLogs, postCycleLog, updateCycleLog, deleteCycleLog } from "../api.js";

export async function renderTracker(onBack) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <header>
      <h1>Period Tracker</h1>
      <button type="button" id="back-btn">Back</button>
    </header>
    
    <form id="period-tracker-form">
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
      <button type="button" id="cancel-edit-btn" style="display:none;">Cancel</button>

    </form>
    
    <section>
      <h2>Period History</h2>
      <div id="period-log"></div>
    </section>
  `;

  const form = document.getElementById("period-tracker-form");
  const errorDisplay = document.getElementById("tracker-error");
  const logContainer = document.getElementById("period-log");
  const dateInput = document.getElementById("period-start-date");
  const notesInput = document.getElementById("notes");
  const submitButton = form.querySelector('button[type="submit"]');

  let logEntries = []; //logs currently loaded from the backend
  let activeEditId = null; //null means add mode; some id means edit mode
  
  async function loadEntries() {
    logContainer.innerHTML = "<p>Loading period logs...</p>";

    try {
      const data = await fetchCycleLogs();
      logEntries = data.data;

      renderEntries(logContainer, logEntries);
    } catch (err) {
      logContainer.innerHTML = "<p>Could not load period log.</p>";
      console.error(err);
    }
  }

  document.getElementById("back-btn").addEventListener("click", () => {
    onBack();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorDisplay.textContent = "";

    const formData = new FormData(form);
    const periodStartDate = formData.get("periodStartDate");
    const notes = formData.get("notes");

    try {
      if (activeEditId) {
        await updateCycleLog({
          id: activeEditId,
          newPeriodStartDate: periodStartDate,
          newNotes: notes,
        });
        activeEditId = null;
        submitButton.textContent = "Save Period";
      } else {
        await postCycleLog({ periodStartDate, notes });
      }
      form.reset();
      await loadEntries();
    } catch (err) {
      errorDisplay.textContent = err.message;
      console.error(err);
    }
  });

  logContainer.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-entry-btn")) {
      if (!confirm("Delete this period entry?")) return;

      const entry = event.target.closest(".period-entry");
      const entryId = entry.dataset.entryId;
 
      try {
        await deleteCycleLog(entryId);
        await loadEntries();
      } catch (err) {
        alert("Could not delete this entry. Please try again.");
        console.error(err);
      }
    }
    
    if (event.target.classList.contains("edit-entry-btn")) {
      const entry = event.target.closest(".period-entry");
      activeEditId = entry.dataset.entryId;
      const selectedEntry = logEntries.find((e) => {
        return String(e.id) === String(activeEditId);
      });
      dateInput.value = selectedEntry.period_start_date.slice(0, 10);
      notesInput.value = selectedEntry.notes || "";
      submitButton.textContent = "Update Period";
      document.getElementById("cancel-edit-btn").style.display = "inline";

      document.getElementById("cancel-edit-btn").addEventListener("click", () => {
        activeEditId = null;
        form.reset();
        submitButton.textContent = "Save Period";
        document.getElementById("cancel-edit-btn").style.display = "none";
      });
    }
  });

  loadEntries();
}

function renderEntries(logContainer, logEntries) {
  logContainer.innerHTML = "";

  if (!logEntries || logEntries.length === 0) {
    logContainer.innerHTML = "<p>No period logged yet.</p>";
    return;
  }

  logEntries.forEach((logEntry) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("period-entry");
    entryDiv.dataset.entryId = logEntry.id;

    const dateHeading = document.createElement("h4");
    dateHeading.textContent = formatDateOnly(logEntry.period_start_date);

    const notesText = document.createElement("p");
    notesText.textContent = logEntry.notes || "No notes";

    const actions = document.createElement("div");
    actions.classList.add("period-entry-actions");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-entry-btn");
    editButton.type = "button";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-entry-btn");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    entryDiv.append(dateHeading, notesText, actions);
    logContainer.appendChild(entryDiv);
  });
}

function formatDateOnly(dateValue) {
  const dateString = dateValue.slice(0, 10);
  const [year, month, day] = dateString.split("-");

  return `${month}/${day}/${year}`;
}

