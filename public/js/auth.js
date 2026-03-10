import * as store from "./store.js";

export const initAuth = () => {
  const userForm = document.getElementById("userForm");
  const usernameInput = document.getElementById("username");
  const logoutBtn = document.getElementById("logout-btn");

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = usernameInput.value.trim();
    if (name) {
      store.setCurrentUser(name);
      userForm.reset();
      if (window.showMainScreen) window.showMainScreen();
    }
  });

  logoutBtn.addEventListener("click", () => {
    store.setCurrentUser(null);
    if (window.showRegistrationScreen) window.showRegistrationScreen();
  });
};
