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

    const threadTitleInput = document.getElementById('thread-title');

    const openModal = () => {
        createThreadModal.classList.remove('hidden');
        if (store.currentCategoryId) {
            threadCategorySelect.value = store.currentCategoryId;
        }
    };

    const closeModal = () => {
        createThreadModal.classList.add('hidden');
        createThreadForm.reset();
        const counter = document.getElementById('thread-title-counter');
        if (counter) counter.textContent = '0/100';
    };

    threadTitleInput.addEventListener('input', () => {
        const length = threadTitleInput.value.length;
        const counter = document.getElementById('thread-title-counter');
        if (counter) {
            counter.textContent = `${length}/100`;
        }
    });

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
            await createThread(newThreadData);
            
        } catch (error) {
            alert('スレッドの作成に失敗しました。');
            return;
        }

        closeModal();
        
        // 最新のスレッド一覧を再取得して描画する
        await loadThreads(categoryId);
    });
};
