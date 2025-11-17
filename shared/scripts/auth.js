document.addEventListener('DOMContentLoaded', () => {
    // Auth Elements
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return; // Do not run if the modal is not on the page

    const closeModalBtn = document.getElementById('close-modal-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register-form');
    const showLoginLink = document.getElementById('show-login-form');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const registerSubmitBtn = document.getElementById('register-submit-btn');
    const loginErrorEl = document.getElementById('login-error');
    const registerErrorEl = document.getElementById('register-error');
    const authButtons = document.getElementById('auth-buttons');
    const userStatus = document.getElementById('user-status');
    const userEmailEl = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    let userToken = localStorage.getItem('authToken');
    let userEmail = localStorage.getItem('userEmail');

    // --- API Configuration ---
    const API_BASE_URL = 'http://localhost:3000';

    // --- Authentication Logic ---
    const updateUIForAuthState = () => {
        if (userToken) {
            authButtons.classList.add('hidden');
            userStatus.classList.remove('hidden');
            userEmailEl.textContent = userEmail;
        } else {
            authButtons.classList.remove('hidden');
            userStatus.classList.add('hidden');
        }
    };

    const openModal = (isLogin = true) => {
        authModal.classList.remove('hidden');
        if (isLogin) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
    };

    const closeModal = () => {
        authModal.classList.add('hidden');
    };

    const handleLogout = () => {
        userToken = null;
        userEmail = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        updateUIForAuthState();
    };

    const handleLogin = async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginErrorEl.textContent = '';

        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            userToken = data.token;
            userEmail = email;
            localStorage.setItem('authToken', userToken);
            localStorage.setItem('userEmail', userEmail);

            updateUIForAuthState();
            closeModal();
        } catch (err) {
            loginErrorEl.textContent = err.message || 'Falha no login.';
        }
    };

    const handleRegister = async () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        registerErrorEl.textContent = '';

        try {
            const res = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Automatically log in the user after successful registration
            await handleLoginAfterRegister(email, password);
        } catch (err) {
            registerErrorEl.textContent = err.message || 'Falha no cadastro.';
        }
    };

    const handleLoginAfterRegister = async (email, password) => {
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = password;
        await handleLogin();
    };

    // --- Event Listeners ---
    loginBtn.addEventListener('click', () => openModal(true));
    registerBtn.addEventListener('click', () => openModal(false));
    closeModalBtn.addEventListener('click', closeModal);
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); openModal(false); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); openModal(true); });
    loginSubmitBtn.addEventListener('click', handleLogin);
    registerSubmitBtn.addEventListener('click', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    // --- Initial Load ---
    updateUIForAuthState();
});
