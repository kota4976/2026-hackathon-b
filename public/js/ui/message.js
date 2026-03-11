import * as store from '../store.js';
import { loadThreads } from './thread.js';
import { fetchThreadContents, postReply } from '../api/thread.js';

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
    } catch (_error) {
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

    // リプライが20件以上の場合、GSAPを使った燃焼アニメーションを実行
    if (replies.length >= 20) {
        // 同時に操作されないようフォーム等を一時無効化（必要に応じて）
        threadDetailContainer.style.pointerEvents = 'none';
        
        const { playBurnAnimation } = await import('./effects.js');
        playBurnAnimation(threadDetailContainer, () => {
            clearThreadDetail();
            
            // GSAPによるインラインスタイルの変更をリセット
            gsap.set(threadDetailContainer, { clearProps: "all" });
            
            // スレッド一覧から現在選択中のスレッドのactive状態も解除する
            const activeThread = document.querySelector('.thread-item.active');
            if (activeThread) {
                activeThread.classList.remove('active');
            }
        });
    }
};

export const initMessageFeature = () => {
    threadDetailContainer = document.getElementById('thread-detail-container');
    emptyStateDetail = document.getElementById('empty-state-detail');
    detailThreadTitle = document.getElementById('detail-thread-title');
    detailThreadAuthor = document.getElementById('detail-thread-author');
    replyList = document.getElementById('reply-list');
    replyForm = document.getElementById('replyForm');
    replyContent = document.getElementById('reply-content');

    replyContent.addEventListener('input', () => {
        if (replyContent.value.length > 100) {
            replyContent.value = replyContent.value.slice(0, 100);
        }
        const length = replyContent.value.length;
        const counter = document.getElementById("reply-content-counter");
        if (counter) {
            counter.textContent = `${length}/100`;
            if (length >= 100) {
                counter.classList.add('limit-exceeded');
            } else {
                counter.classList.remove('limit-exceeded');
            }
        }
    });

    // リプライ送信
    replyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!store.currentThreadId) return;

        const content = replyContent.value.trim();
        if (!content) return;

        try {
            await postReply(store.currentThreadId, { name: store.currentUser, content });
        } catch (_error) {
            alert('リプライの送信に失敗しました。');
            return;
        }

        replyForm.reset();
        const counter = document.getElementById("reply-content-counter");
        if (counter) counter.textContent = "0/100";
        
        // 再描画
        await loadReplies(store.currentThreadId);
        
        // 最新のスレッド一覧も再描画してリプライ数を更新
        // その際、右画面がクリアされないように第2引数にtrueを渡す
        if (store.currentCategoryId) {
            await loadThreads(store.currentCategoryId, true);
        }
        
        // 選択状態を再付与 (再描画によってDOMが書き換わるため)
        setTimeout(() => {
            document.querySelector(`.thread-item[data-id="${store.currentThreadId}"]`)?.classList.add('active');
        }, 50);
    });
};
