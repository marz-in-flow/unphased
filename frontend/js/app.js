// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// }
import { renderLogin } from './screens/login.js';
import { renderOnboarding } from './screens/onboarding.js';
import { renderToday } from './screens/today.js';
import { renderMind } from './screens/mind.js';
import { renderBody } from './screens/body.js';
import { renderRest } from './screens/rest.js';
import { isLowEnergy, getMe, setOnUnauthorized } from './api.js';

setOnUnauthorized(routeAfterAuth);

document.addEventListener("DOMContentLoaded", () => {
  routeAfterAuth();
});

async function routeAfterAuth(context = {}) {
  const me = await getMe();

  if (!me.authenticated) {
    localStorage.removeItem("lowEnergy");
    const message = context.reason === "session_expired"
      ? "Your session expired. Please log in again."
      : null;
    renderLogin(routeAfterAuth, message);
    return;
  }

  if (!me.hasProfile) {
    renderOnboarding(routeAfterAuth);
    return;
  }

  showMainApp("today", routeAfterAuth);
}

function showMainApp(view, onComplete) {
  document.getElementById("bottom-nav").style.display = "flex";
  showView(view, onComplete);
}

function showView(view, onComplete) {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${view}"]`).classList.add('active');

  if (view === "today") {
    renderToday(onComplete);
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
  if (tab) showView(tab, tab === "today" ? routeAfterAuth : undefined);
});