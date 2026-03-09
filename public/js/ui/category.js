import { store } from '../store.js';
import { loadThreads } from './thread.js';
import { clearThreadDetail } from './message.js';

export const loadCategories = () => {
    const categoryList = document.getElementById('category-list');
    const threadCategorySelect = document.getElementById('thread-category');
    const currentCategoryTitle = document.getElementById('current-category-title');

    categoryList.innerHTML = '';
    threadCategorySelect.innerHTML = ''; // Populate modal select too

    store.MOCK_CATEGORIES.forEach(cat => {
        // Sidebar item
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

        // Modal option
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        threadCategorySelect.appendChild(option);
    });

    // Auto-select first category if none selected
    if (!store.currentCategoryId && store.MOCK_CATEGORIES.length > 0) {
        // Trigger click on first
        categoryList.firstChild.click();
    }
};
