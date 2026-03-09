// Centralized State and Mock Data

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

// Mock Data
export const MOCK_CATEGORIES = [
    { id: 'c1', name: 'Test' },
    { id: 'c2', name: 'Research' },
    { id: 'c3', name: 'Work' }
];

export let MOCK_THREADS = [
    { id: 't1', category_id: 'c1', name: 'Alice', title: 'Is this working?' },
    { id: 't2', category_id: 'c3', name: 'Bob', title: 'Project Update Q3' },
    { id: 't3', category_id: 'c2', name: 'Charlie', title: 'React vs Vue discussion' }
];

export let MOCK_REPLIES = {
    't1': [
        { name: 'Alice', content: 'Just testing the new system.' },
        { name: 'Bob', content: 'Looks good from here!' }
    ],
    't2': [
        { name: 'Bob', content: 'Here are the latest stats...' },
        { name: 'Alice', content: 'Thanks.' },
        { name: 'Charlie', content: 'Can we schedule a sync?' }
    ]
};

export const addThread = (thread) => {
    MOCK_THREADS.unshift(thread);
};

export const addReply = (threadId, name, content) => {
    if (!MOCK_REPLIES[threadId]) {
        MOCK_REPLIES[threadId] = [];
    }
    MOCK_REPLIES[threadId].push({ name, content });
};
