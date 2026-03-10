import * as store from '../store.js';
import { loadCategories } from './category.js';
import { createThread } from '../api/thread.js';

export const initModalFeature = () => {
    // ... [existing element queries]
    const createThreadBtn = document.getElementById('open-create-thread-btn');
    const createThreadModal = document.getElementById('create-thread-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelThreadBtn = document.getElementById('cancel-thread-btn');
    const createThreadForm = document.getElementById('createThreadForm');
    const threadCategorySelect = document.getElementById('thread-category');

    const openModal = () => {
        createThreadModal.classList.remove('hidden');
        if (store.currentCategoryId) {
            threadCategorySelect.value = store.currentCategoryId;
        }
    };

    const closeModal = () => {
        createThreadModal.classList.add('hidden');
        createThreadForm.reset();
    };

    createThreadBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelThreadBtn.addEventListener('click', closeModal);

    createThreadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('thread-title').value.trim();
        const categoryId = parseInt(document.getElementById('thread-category').value, 10);

        if (!title || !categoryId) return;

        const newThreadData = {
            categoryId: categoryId,
            name: store.currentUser,
            title: title
        };

        try {
            // バックエンドに新規スレッド作成リクエストを送信
            await createThread(newThreadData);
        } catch (error) {
            alert('スレッドの作成に失敗しました。');
            return;
        }

        closeModal();
        
        // 対象カテゴリを選択して再読み込み
        const catList = document.querySelectorAll('.category-item');
        let optionToClick = null;
        catList.forEach(item => {
            if(item.dataset.id === categoryId.toString()) optionToClick = item;
        });
        if(optionToClick) {
            optionToClick.click();
        } else {
             loadCategories(); // フォールバック
        }
    });
};
