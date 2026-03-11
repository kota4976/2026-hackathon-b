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
  const searchInput = document.getElementById('thread-search');
  const threadList = document.getElementById('thread-list');
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
  
  //検索機能
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase(); // 検索文字を小文字に統一
    const threads = threadList.getElementsByClassName('thread-item'); // 各スレッドの要素

    Array.from(threads).forEach(thread => {
      // スレッド内のテキスト（タイトルなど）を取得
      const title = thread.textContent.toLowerCase();
    
      if (title.includes(keyword)) {
      thread.classList.remove('hidden'); // キーワードが含まれば表示
      } else {
      thread.classList.add('hidden');    // 含まれなければ非表示
      }
    });
});
});
