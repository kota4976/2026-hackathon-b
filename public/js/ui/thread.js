import * as store from "../store.js";
import { clearThreadDetail, showThreadDetail } from "./message.js";
import { fetchThreads } from "../api/thread.js";

export const loadThreads = async (categoryId, preserveDetailState = false) => {
  const threadList = document.getElementById("thread-list");
  threadList.innerHTML = "";

  // スレッド詳細画面はカテゴリ切り替えで常にクリアするが、リプライ時は維持する
  if (!preserveDetailState) {
    clearThreadDetail();
  }

  try {
    const filteredThreads = await fetchThreads(categoryId);

    if (!filteredThreads || filteredThreads.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";
      emptyDiv.style.padding = "20px";
      emptyDiv.textContent = "まだスレッドがありません。";
      threadList.appendChild(emptyDiv);
      return;
    }

    filteredThreads.forEach((thread) => {
      const div = document.createElement("div");
      div.className = "thread-item";
      // 文字列として扱うために変換する（backendがnumberで返すため）
      div.dataset.id = thread.threadId.toString();

      // スレッドタイトル
      const titleDiv = document.createElement("div");
      titleDiv.className = "thread-item-title";
      titleDiv.textContent = thread.title;

      // メタ情報 (投稿者名など)
      const metaDiv = document.createElement("div");
      metaDiv.className = "thread-item-meta";
      
      const authorSpan = document.createElement("span");
      authorSpan.textContent = thread.name;
      
      const countSpan = document.createElement('span');
      countSpan.className = 'reply-count';
      countSpan.textContent = `リプライ: ${thread.replyCount}`;
      countSpan.style.marginLeft = '10px';
      countSpan.style.color = '#ff6b6b';

      metaDiv.appendChild(authorSpan);
      metaDiv.appendChild(countSpan);

      // 組み立て
      div.appendChild(titleDiv);
      div.appendChild(metaDiv);

      div.addEventListener("click", () => {
        selectThread(thread);
      });
      threadList.appendChild(div);
    });
  } catch (error) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "empty-state";
    errorDiv.style.padding = "20px";
    errorDiv.style.color = "red";
    errorDiv.textContent = "スレッドの取得に失敗しました。";
    threadList.appendChild(errorDiv);
    console.error(error);
  }
};

export const selectThread = (thread) => {
  const tid = thread.threadId.toString();
  store.setCurrentThread(tid);

  // 選択状態の更新
  document.querySelectorAll(".thread-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === tid);
  });

  // メッセージ詳細画面（元のスレッドオブジェクトを一時的に渡す。あとで直せるようにID補正）
  const safeThread = { ...thread, id: tid };
  showThreadDetail(safeThread);
};

export const initThreadFeature = () => {};
