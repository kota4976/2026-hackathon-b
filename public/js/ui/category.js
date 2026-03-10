import * as store from '../store.js';
import { loadThreads } from './thread.js';
import { clearThreadDetail } from './message.js';

export const loadCategories = () => {
    const categoryList = document.getElementById('category-list');
    const threadCategorySelect = document.getElementById('thread-category');
    const currentCategoryTitle = document.getElementById('current-category-title');

    categoryList.innerHTML = '';
    threadCategorySelect.innerHTML = ''; // モーダルの選択肢も更新

    store.MOCK_CATEGORIES.forEach(cat => {
        // サイドバー項目
        const li = document.createElement('li');
        li.className = 'category-item';
        li.textContent = cat.name;
        li.dataset.id = cat.id;
        li.addEventListener('click', () => {
            store.setCurrentCategory(cat.id);
            currentCategoryTitle.textContent = cat.name;
            
            document.querySelectorAll('.category-item').forEach(el => {
                el.classList.toggle('active', el.dataset.id === cat.id);
            });

            loadThreads(cat.id);
            clearThreadDetail();
        });
        categoryList.appendChild(li);

        // モーダル選択肢
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        threadCategorySelect.appendChild(option);
    });

    // 初期選択
    if (!store.currentCategoryId && store.MOCK_CATEGORIES.length > 0) {
        categoryList.firstChild.click();
    }
};
