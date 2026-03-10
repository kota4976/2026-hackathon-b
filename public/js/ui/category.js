import * as store from '../store.js';
import { loadThreads } from './thread.js';
import { clearThreadDetail } from './message.js';
import { fetchCategories } from '../api/category.js';

export const loadCategories = async () => {
    const categoryList = document.getElementById('category-list');
    const threadCategorySelect = document.getElementById('thread-category');
    const currentCategoryTitle = document.getElementById('current-category-title');

    categoryList.innerHTML = '';
    threadCategorySelect.innerHTML = ''; // モーダルの選択肢も更新

    try {
        // APIからデータを取得
        const categories = await fetchCategories();

        categories.forEach(cat => {
            // バックエンドの categoryId をフロントエンドで扱いやすいようにマッピング
            const catId = cat.categoryId.toString();
            const catName = cat.name;

            // サイドバー項目
            const li = document.createElement('li');
            li.className = 'category-item';
            li.textContent = catName;
            li.dataset.id = catId;
            li.addEventListener('click', () => {
                store.setCurrentCategory(catId);
                currentCategoryTitle.textContent = catName;
                
                document.querySelectorAll('.category-item').forEach(el => {
                    el.classList.toggle('active', el.dataset.id === catId);
                });

                loadThreads(catId);
                clearThreadDetail();
            });
            categoryList.appendChild(li);

            // モーダル選択肢
            const option = document.createElement('option');
            option.value = catId;
            option.textContent = catName;
            threadCategorySelect.appendChild(option);
        });

        // 初期選択
        if (!store.currentCategoryId && categories.length > 0) {
            categoryList.firstChild.click();
        }
    } catch (error) {
        const errorLi = document.createElement('li');
        errorLi.className = 'category-item';
        errorLi.style.color = 'red';
        errorLi.textContent = '読み込み失敗';
        categoryList.appendChild(errorLi);
    }
};
