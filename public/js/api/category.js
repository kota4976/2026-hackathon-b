export const fetchCategories = async () => {
    try {
        const response = await fetch('/category');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("カテゴリの取得に失敗しました:", error);
        throw error;
    }
};
