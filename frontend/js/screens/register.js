import { renderLogin } from './login.js';
import { postRegister } from '../api.js';

export function renderRegister(onComplete) {
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

      <form id="register-form">
        <div>
          <label for="email">Enter your email </label>
          <input type="email" id="email" name="email" required/>
        </div>
        
        <div>
          <label for="pass">Create password (8 characters minimum) </label>
          <input type="password" id="password" name="password" minlength="8" required/>
        </div>

        <p id="register-error"></p>
      
        <button type="submit">Continue</button>
      </form>

      <div class="auth-switch">
        <p>Have an account?</p>
        <button type="button" id="to-login">Log in</button>
      </div>

    </section>
  `;

  const form = document.getElementById("register-form");
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
