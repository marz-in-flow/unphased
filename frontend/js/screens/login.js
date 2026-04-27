import { renderRegister } from './register.js';
import { postLogin } from '../api.js';

export function renderLogin(onComplete) {
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

      <form id="login-form">
        <div>
          <label for="email">Email </label>
          <input type="email" id="email" name="email" required/>
        </div>
        
        <div>
          <label for="pass">Password (8 characters minimum) </label>
          <input type="password" id="password" name="password" minlength="8" required/>
        </div>

        <p id="login-error"></p>
      
        <button type="submit">Continue</button>
      </form>

      <div class="auth-switch">
        <p>Don’t have an account?</p>
        <button type="button" id="to-register">Create one</button>
      </div>

    </section>
  `;

  const form = document.getElementById("login-form");
  const errorDisplay = document.getElementById("login-error");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorDisplay.textContent = "";
    
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
     await postLogin({ email, password });

      if (onComplete) {
        onComplete();
      }
    } catch (errorObj) {
      errorDisplay.textContent = errorObj.message;
      console.error(errorObj);
    }
  });

  document.querySelector("#to-register").addEventListener("click", () => {
    renderRegister(onComplete);
  });
}