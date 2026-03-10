import * as store from "./store.js";

export const initAuth = () => {
  const userForm = document.getElementById("userForm");
  const usernameInput = document.getElementById("username");
  const logoutBtn = document.getElementById("logout-btn");

  usernameInput.addEventListener("input", () => {
    const length = usernameInput.value.length;
    const counter = document.getElementById("username-counter");
    if (counter) {
      counter.textContent = `${length}/20`;
    }
  });

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = usernameInput.value.trim();
    if (name) {
      store.setCurrentUser(name);
      userForm.reset();
      // リセット後にカウンタを戻す
      const counter = document.getElementById("username-counter");
      if (counter) counter.textContent = "0/20";
      if (window.showMainScreen) window.showMainScreen();
    }
  });

  logoutBtn.addEventListener("click", () => {
    store.setCurrentUser(null);
    if (window.showRegistrationScreen) window.showRegistrationScreen();
  });
};
