import { store } from '../store.js';
import { showThreadDetail } from './message.js';

export const loadThreads = (categoryId) => {
    const threadList = document.getElementById('thread-list');
    threadList.innerHTML = '';
    const filteredThreads = store.MOCK_THREADS.filter(t => t.category_id === categoryId);

    if (filteredThreads.length === 0) {
        threadList.innerHTML = '<div class="empty-state" style="padding: 20px;">No threads yet.</div>';
        return;
    }

    filteredThreads.forEach(thread => {
        const div = document.createElement('div');
        div.className = 'thread-item';
        div.dataset.id = thread.id;
        
        div.innerHTML = `
            <div class="thread-item-title">${thread.title}</div>
            <div class="thread-item-meta">
                <span>${thread.name}</span>
            </div>
        `;
        
        div.addEventListener('click', () => {
            selectThread(thread);
        });
        threadList.appendChild(div);
    });
};

export const selectThread = (thread) => {
    store.setCurrentThread(thread.id);
    
    // Highlight active
    document.querySelectorAll('.thread-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === thread.id);
    });

    showThreadDetail(thread);
};

export const initThreadFeature = () => {
    // Initial load will be triggered by category selection
};
