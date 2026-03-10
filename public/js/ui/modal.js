import * as store from "../store.js";
import { loadCategories } from "./category.js";

export const initModalFeature = () => {
  const createThreadBtn = document.getElementById("open-create-thread-btn");
  const createThreadModal = document.getElementById("create-thread-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const cancelThreadBtn = document.getElementById("cancel-thread-btn");
  const createThreadForm = document.getElementById("createThreadForm");
  const threadCategorySelect = document.getElementById("thread-category");

  const openModal = () => {
    createThreadModal.classList.remove("hidden");
    // 現在のカテゴリを選択状態にする
    if (store.currentCategoryId) {
      threadCategorySelect.value = store.currentCategoryId;
    }
  };

  const closeModal = () => {
    createThreadModal.classList.add("hidden");
    createThreadForm.reset();
  };

  createThreadBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelThreadBtn.addEventListener("click", closeModal);

  createThreadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("thread-title").value.trim();
    const categoryId = document.getElementById("thread-category").value;

    if (!title || !categoryId) return;

    const newThread = {
      threadId: Date.now().toString(), // バックエンドに合わせて文字列や数字に変更
      categoryId: categoryId,
      name: store.currentUser,
      title: title,
    };

    store.addThread(newThread);

    closeModal();

    // 対象カテゴリを選択して再読み込み
    const catList = document.querySelectorAll(".category-item");
    let optionToClick = null;
    catList.forEach((item) => {
      if (item.dataset.id === categoryId) optionToClick = item;
    });
    if (optionToClick) {
      optionToClick.click();
    } else {
      loadCategories(); // フォールバック
    }
  });
};
