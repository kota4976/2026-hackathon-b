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

// モックデータ

export let MOCK_THREADS = [
    { threadId: '1', categoryId: '1', name: '田中', title: '必修の単位落とすかもしれん…' },
    { threadId: '2', categoryId: '3', name: '佐藤', title: '店長がシフト勝手に入れてくる' },
    { threadId: '3', categoryId: '2', name: '鈴木', title: '教授の無茶振りがエグい' }
];

export let MOCK_REPLIES = {
    '1': [
        { name: '田中', content: 'レポートの締め切り今日だったのマジで知らんかった。' },
        { name: '山田', content: 'うわ、どんまい。俺も1年ん時やらかしたわ。' },
        { name: '田中', content: '教授に土下座メール送ってみる…' }
    ],
    '2': [
        { name: '佐藤', content: '明日休みなのに勝手に出勤になってる。マジでありえない。' },
        { name: '高橋', content: '労基案件でしょそれ。辞めた方がいいよ。' },
        { name: '佐藤', content: '次の給料出たらマジで飛ぶわ。' }
    ],
    '3': [
        { name: '鈴木', content: '明日までに英語の論文10本読んでこいとか正気か？' },
        { name: '山田', content: '絶対無理やろそれｗ 寝れないじゃん。' },
        { name: '鈴木', content: 'もう諦めてYouTube見てるわ。おやすみ。' }
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
