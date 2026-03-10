import * as store from '../store.js';
import { loadThreads } from './thread.js';
import { fetchThreadContents } from '../api/thread.js';

let threadDetailContainer, emptyStateDetail, detailThreadTitle, detailThreadAuthor, replyList, replyForm, replyContent;

export const clearThreadDetail = () => {
    store.setCurrentThread(null);
    threadDetailContainer.classList.add('hidden');
    emptyStateDetail.classList.remove('hidden');
    if (replyList) replyList.style.backgroundColor = '';
};

export const showThreadDetail = async (thread) => {
    emptyStateDetail.classList.add('hidden');
    threadDetailContainer.classList.remove('hidden');
    
    detailThreadTitle.textContent = thread.title;
    detailThreadAuthor.textContent = `投稿者: ${thread.name}`;
    
    await loadReplies(thread.threadId);
};

export const loadReplies = async (threadId) => {
    replyList.innerHTML = '';
    
    let replies = [];
    try {
        const threadData = await fetchThreadContents(threadId);
        replies = threadData.reply || [];
    } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'empty-state';
        errorDiv.style.marginTop = '20px';
        errorDiv.style.color = 'red';
        errorDiv.textContent = '返信の取得に失敗しました。';
        replyList.appendChild(errorDiv);
        return;
    }

    // 背景色は固定（CSSに従う）
    replyList.style.backgroundColor = '';


    if (replies.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.style.marginTop = '20px';
        emptyDiv.textContent = 'まだ返信がありません。最初の返信をしよう！';
        replyList.appendChild(emptyDiv);
        return;
    }

    replies.forEach(reply => {
        const isMine = reply.name === store.currentUser;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isMine ? 'mine' : ''}`;
        
        // ヘッダー部分
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = reply.name;
        
        headerDiv.appendChild(authorSpan);
        
        // 本文部分
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = reply.content;
        
        // 組み立て
        msgDiv.appendChild(headerDiv);
        msgDiv.appendChild(bubbleDiv);
        
        replyList.appendChild(msgDiv);
    });

    // 最下部へスクロール
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

    // リプライ送信
    replyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!store.currentThreadId) return;

        const content = replyContent.value.trim();
        if (!content) return;

        store.addReply(store.currentThreadId, store.currentUser, content);

        replyForm.reset();
        
        // 再描画
        await loadReplies(store.currentThreadId);
        
        // 選択状態を維持
        document.querySelector(`.thread-item[data-id="${store.currentThreadId}"]`)?.classList.add('active');
    });
};
