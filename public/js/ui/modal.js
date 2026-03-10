import * as store from '../store.js';
import { loadThreads } from './thread.js';
import { createThread } from '../api/thread.js';

export const initModalFeature = () => {
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
            // await createThread(newThreadData);
            const newThread = await createThread(newThreadData);
            console.log("投稿が完了しました", newThread);
            
        } catch (error) {
            alert('スレッドの作成に失敗しました。');
            return;
        }

        closeModal();
        
        // 最新のスレッド一覧を再取得して描画する
        await loadThreads(categoryId);
    });
};
