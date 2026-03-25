import { renderOnboarding } from './onboarding.js';
import { renderToday } from './today.js';
import { renderMind } from './mind.js';
import { renderBody } from './body.js';
import { renderRest } from './rest.js';

document.addEventListener("DOMContentLoaded", () => {
  const profile = localStorage.getItem("cycleProfile");

  if (!profile) {
    showOnboarding();
  } else {
    showMainApp("today");
  }
});

function showOnboarding() {
  document.getElementById("bottom-nav").style.display = "none";
  document.getElementById("app-header").style.display = "none";
  renderOnboarding(() => {
    showMainApp("today");
  });
}

function showMainApp(view) {
  document.getElementById("bottom-nav").style.display = "flex";
  document.getElementById("app-header").style.display = "block";
  showView(view);
}

function showView(view) {
  if (view === "today") {
    renderToday();
  } else if (view === "mind") {
    renderMind();
  } else if (view === "body") {
    renderBody();
  } else if (view === "rest") {
    renderRest();
  }
}

document.getElementById("bottom-nav").addEventListener("click", (e) => {
  const tab = e.target.dataset.tab;
  if (tab) showView(tab);
});