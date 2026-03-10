import * as store from "./store.js";
import { loadCategories } from "./ui/category.js";
import { initThreadFeature } from "./ui/thread.js";
import { initMessageFeature } from "./ui/message.js";
import { initModalFeature } from "./ui/modal.js";
import { initResizer } from "./ui/resizer.js";
import { initAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const regScreen = document.getElementById("registration-screen");
  const mainScreen = document.getElementById("main-app-screen");
  const currentUsernameSpan = document.getElementById("current-username");

  // 画面切り替え
  window.showMainScreen = () => {
    regScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    currentUsernameSpan.textContent = store.currentUser;

    // UI初期化（イベントリスナーやDOM要素の取得を先に行う）
    initThreadFeature();
    initMessageFeature();
    initModalFeature();
    initResizer();

    // その後、初期データを読み込んで画面に反映（ここでclickイベント等が発火する）
    loadCategories();
  };

  window.showRegistrationScreen = () => {
    regScreen.classList.remove("hidden");
    mainScreen.classList.add("hidden");
  };

  // 認証初期化
  initAuth();

  // 初期状態の復元
  if (store.currentUser) {
    window.showMainScreen();
  } else {
    window.showRegistrationScreen();
  }
});
