document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');

    const saveUser = (name) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ name });
        localStorage.setItem('users', JSON.stringify(users));
    };

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('username').value;

        saveUser(name);
        alert('登録しました');

        userForm.reset();
    });
});
