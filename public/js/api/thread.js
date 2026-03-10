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
