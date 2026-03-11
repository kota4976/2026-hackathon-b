// 状態とモックデータ

export let currentUser = localStorage.getItem("app_username") || null;
export let currentCategoryId = null;
export let currentThreadId = null;

export const setCurrentUser = (user) => {
  currentUser = user;
  if (user) {
    localStorage.setItem("app_username", user);
  } else {
    localStorage.removeItem("app_username");
  }
};

export const setCurrentCategory = (id) => {
  currentCategoryId = id;
};

export const setCurrentThread = (id) => {
  currentThreadId = id;
};

// いいね情報のローカルストレージ管理
const LIKES_STORAGE_KEY = "app_liked_replies";

const getLikedRepliesMap = () => {
    try {
        const data = localStorage.getItem(LIKES_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
};

const saveLikedRepliesMap = (map) => {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(map));
};

export const isReplyLiked = (threadId, replyIndex) => {
    const map = getLikedRepliesMap();
    const key = `${threadId}-${replyIndex}`;
    return !!map[key];
};

export const toggleReplyLikeLocal = (threadId, replyIndex) => {
    const map = getLikedRepliesMap();
    const key = `${threadId}-${replyIndex}`;
    
    let action = "add";
    if (map[key]) {
        delete map[key];
        action = "remove";
    } else {
        map[key] = true;
        action = "add";
    }
    
    saveLikedRepliesMap(map);
    return action;
};
