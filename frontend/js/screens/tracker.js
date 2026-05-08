export async function renderTracker(onComplete) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <header>
      <button id="back-btn">Back</button>
      <h1>Period Tracker</h1>
    </header>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    onComplete();
  });
}
