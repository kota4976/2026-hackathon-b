import * as store from '../store.js';
import { showThreadDetail } from './message.js';

export const loadThreads = (categoryId) => {
    const threadList = document.getElementById('thread-list');
    threadList.innerHTML = '';
    const filteredThreads = store.MOCK_THREADS.filter(t => t.categoryId === categoryId);

    if (filteredThreads.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.style.padding = '20px';
        emptyDiv.textContent = 'まだスレッドがありません。';
        threadList.appendChild(emptyDiv);
        return;
    }

    filteredThreads.forEach(thread => {
        const div = document.createElement('div');
        div.className = 'thread-item';
        div.dataset.id = thread.threadId; // DOMの dataset.id は既存の仕組みに合わせる
        
        // スレッドタイトル
        const titleDiv = document.createElement('div');
        titleDiv.className = 'thread-item-title';
        titleDiv.textContent = thread.title;

        // メタ情報 (投稿者名など)
        const metaDiv = document.createElement('div');
        metaDiv.className = 'thread-item-meta';
        const authorSpan = document.createElement('span');
        authorSpan.textContent = thread.name;
        metaDiv.appendChild(authorSpan);

        // 組み立て
        div.appendChild(titleDiv);
        div.appendChild(metaDiv);
        
        div.addEventListener('click', () => {
            selectThread(thread);
        });
        threadList.appendChild(div);
    });
};

export const selectThread = (thread) => {
    store.setCurrentThread(thread.threadId);
    
    // 選択状態の更新
    document.querySelectorAll('.thread-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === thread.threadId);
    });

    showThreadDetail(thread);
};

export const initThreadFeature = () => {};
