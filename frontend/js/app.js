import { renderOnboarding } from './onboarding.js';
import { renderToday } from './today.js';
import { renderMind } from './mind.js';
import { renderBody } from './body.js';
import { renderRest } from './rest.js';
import { isLowEnergy } from './api.js';

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
  renderOnboarding(() => {
    showMainApp("today");
  });
}

function showMainApp(view) {
  document.getElementById("bottom-nav").style.display = "flex";
  showView(view);
}

function showView(view) {
  const lowEnergy = isLowEnergy();

  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${view}"]`).classList.add('active');

  if (view === "today") {
    renderToday();
  } else if (view === "mind") {
    renderMind(lowEnergy);
  } else if (view === "body") {
    renderBody(lowEnergy);
  } else if (view === "rest") {
    renderRest(lowEnergy);
  }
}

document.getElementById("bottom-nav").addEventListener("click", (e) => {
  const tab = e.target.dataset.tab;
  if (tab) showView(tab);
});