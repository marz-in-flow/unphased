if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
import { renderLogin } from './screens/login.js';
import { renderOnboarding } from './screens/onboarding.js';
import { renderToday } from './screens/today.js';
import { renderMind } from './screens/mind.js';
import { renderBody } from './screens/body.js';
import { renderRest } from './screens/rest.js';
import { isLowEnergy } from './api.js';
import { getMe } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  routeAfterAuth();
});

async function routeAfterAuth() {
  const me = await getMe();

  if (!me.authenticated) {
    renderLogin(routeAfterAuth);
    return;
  }

  if (!me.hasProfile) {
    renderOnboarding(routeAfterAuth);
    return;
  }

  showMainApp("today");
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