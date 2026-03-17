export function renderToday() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Today</h2>
    <p>Your daily guidance goes here.</p>
  `;
}