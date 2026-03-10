export const fetchThreads = async (categoryId) => {
    try {
        const response = await fetch(`/thread/list?categoryId=${categoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.threads || [];
    } catch (error) {
        console.error("スレッド一覧の取得に失敗しました:", error);
        throw error;
    }
};

export const fetchThreadContents = async (threadId) => {
    try {
        const response = await fetch(`/thread/contents?threadId=${threadId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("スレッド詳細の取得に失敗しました:", error);
        throw error;
    }
};

export const createThread = async (threadData) => {
    try {
        const response = await fetch('/thread', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(threadData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("スレッドの作成に失敗しました:", error);
        throw error;
    }
};

export const postReply = async (threadId, replyData) => {
    try {
        const response = await fetch(`/thread/reply?threadId=${threadId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(replyData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("リプライの送信に失敗しました:", error);
        throw error;
    }
};
