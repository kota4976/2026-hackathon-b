import * as store from '../store.js';
import { initCategoryFeature } from './ui/category.js';
import { initThreadFeature } from './ui/thread.js';
import { initMessageFeature } from './ui/message.js';
import { initModalFeature } from './ui/modal.js';
import { initAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const regScreen = document.getElementById('registration-screen');
    const mainScreen = document.getElementById('main-app-screen');
    const currentUsernameSpan = document.getElementById('current-username');

    // Centralized visibility toggling to be called from auth
    window.showMainScreen = () => {
        regScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        currentUsernameSpan.textContent = store.currentUser;
        
        // Initialize UI components once logged in
        initCategoryFeature();
        initThreadFeature();
        initMessageFeature();
        initModalFeature();
    };

    window.showRegistrationScreen = () => {
        regScreen.classList.remove('hidden');
        mainScreen.classList.add('hidden');
    };

    // Initialize Auth
    initAuth();

    // Check initial state
    if (store.currentUser) {
        window.showMainScreen();
    } else {
        window.showRegistrationScreen();
    }
});
