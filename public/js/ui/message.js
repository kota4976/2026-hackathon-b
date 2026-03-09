import { store } from '../store.js';
import { loadThreads } from './thread.js';

let threadDetailContainer, emptyStateDetail, detailThreadTitle, detailThreadAuthor, replyList, replyForm, replyContent;

export const clearThreadDetail = () => {
    store.setCurrentThread(null);
    threadDetailContainer.classList.add('hidden');
    emptyStateDetail.classList.remove('hidden');
};

export const showThreadDetail = (thread) => {
    emptyStateDetail.classList.add('hidden');
    threadDetailContainer.classList.remove('hidden');
    
    detailThreadTitle.textContent = thread.title;
    detailThreadAuthor.textContent = `by ${thread.name}`;
    
    loadReplies(thread.id);
};

export const loadReplies = (threadId) => {
    replyList.innerHTML = '';
    const replies = store.MOCK_REPLIES[threadId] || [];

    if (replies.length === 0) {
        replyList.innerHTML = '<div class="empty-state" style="margin-top:20px;">No replies yet. Be the first to reply!</div>';
        return;
    }

    replies.forEach(reply => {
        const isMine = reply.name === store.currentUser;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isMine ? 'mine' : ''}`;
        
        msgDiv.innerHTML = `
            <div class="message-header">
                <span class="message-author">${reply.name}</span>
            </div>
            <div class="message-bubble">${reply.content}</div>
        `;
        replyList.appendChild(msgDiv);
    });

    // Scroll to bottom
    replyList.scrollTop = replyList.scrollHeight;
};

export const initMessageFeature = () => {
    threadDetailContainer = document.getElementById('thread-detail-container');
    emptyStateDetail = document.getElementById('empty-state-detail');
    detailThreadTitle = document.getElementById('detail-thread-title');
    detailThreadAuthor = document.getElementById('detail-thread-author');
    replyList = document.getElementById('reply-list');
    replyForm = document.getElementById('replyForm');
    replyContent = document.getElementById('reply-content');

    // Reply Submit
    replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!store.currentThreadId) return;

        const content = replyContent.value.trim();
        if (!content) return;

        store.addReply(store.currentThreadId, store.currentUser, content);

        replyForm.reset();
        
        // Re-render
        loadReplies(store.currentThreadId);
        
        // Keep selected state
        document.querySelector(`.thread-item[data-id="${store.currentThreadId}"]`)?.classList.add('active');
    });
};
