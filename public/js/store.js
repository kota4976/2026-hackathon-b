// 状態とモックデータ

export let currentUser = localStorage.getItem('app_username') || null;
export let currentCategoryId = null;
export let currentThreadId = null;

export const setCurrentUser = (user) => {
    currentUser = user;
    if (user) {
        localStorage.setItem('app_username', user);
    } else {
        localStorage.removeItem('app_username');
    }
};

export const setCurrentCategory = (id) => {
    currentCategoryId = id;
};

export const setCurrentThread = (id) => {
    currentThreadId = id;
};


export let MOCK_REPLIES = {};

export const addThread = (thread) => {
    MOCK_THREADS.unshift(thread);
};

export const addReply = (threadId, name, content) => {
    if (!MOCK_REPLIES[threadId]) {
        MOCK_REPLIES[threadId] = [];
    }
    MOCK_REPLIES[threadId].push({ name, content });
};
