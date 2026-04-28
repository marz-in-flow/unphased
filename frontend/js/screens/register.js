import { renderLogin } from './login.js';
import { postRegister } from '../api.js';

export function renderRegister(onComplete) {
  document.getElementById("bottom-nav").style.display = "none";
  document.body.className = "mode-onboarding";

  const content = document.getElementById("content");
  content.innerHTML = `
  <section class="onboarding-screen">
    <header class="onboarding-header">
      <img
        src="images/unphased-logo-v3.png"
        alt="unPhased logo"
        class="onboarding-logo"
      />
    <p>Daily Direction, Powered by Your Biology</p>
    </header>
    <form id="onboarding-form">
      <label for="email">Enter your email </label>
      <input type="email" id="email" name="email" required/>
      <label for="password">Create password (8 characters minimum) </label>
      <input type="password" id="password" name="password" minlength="8" required/>
      <p id="register-error"></p>
      <button type="submit">Register</button>
      <label for="to-login">Have an account?</label>
      <button type="button" id="to-login">Log in</button>
  </form>
  </section>
  `;

  const form = document.getElementById("onboarding-form");
  const errorDisplay = document.getElementById("register-error");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorDisplay.textContent = "";
    
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await postRegister({ email, password });

      if (onComplete) {
        onComplete();
      }
    } catch (errorObj) {
      errorDisplay.textContent = errorObj.message;
      console.error(errorObj);
    }
  });

  document.querySelector("#to-login").addEventListener("click", () => {
    renderLogin(onComplete);
  });
}
