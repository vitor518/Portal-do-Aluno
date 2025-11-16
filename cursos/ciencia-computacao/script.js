document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Views
    const dashboardView = document.getElementById('dashboard-view');
    const courseView = document.getElementById('course-view');
    const dependencyView = document.getElementById('dependency-view');
    // Common
    const courseViewTitle = document.getElementById('course-view-title');
    const coursesGridContainer = document.getElementById('courses-grid-container');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const toggleViewBtn = document.getElementById('toggle-view-btn');
    const scheduleContainer = document.getElementById('schedule-container');

    // Auth Elements
    const authModal = document.getElementById('auth-modal');
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

    // Pomodoro Elements
    const pomodoroTimerEl = document.getElementById('pomodoro-timer');
    const pomodoroStartBtn = document.getElementById('pomodoro-start');
    const pomodoroPauseBtn = document.getElementById('pomodoro-pause');
    const pomodoroResetBtn = document.getElementById('pomodoro-reset');

    // Importa o sistema unificado de storage
    const courseName = 'ciencia-computacao';
    let courseProgress = storage.getCourseProgress(courseName).progress || {};
    let earnedBadges = storage.getCourseProgress(courseName).badges || [];
    let currentView = 'dashboard';
    let currentSemesterIndex = -1;
    let userToken = localStorage.getItem('authToken');
    let userEmail = localStorage.getItem('userEmail');

    // Pomodoro State
    let timerInterval;
    let timerSeconds = 1500;
    let isTimerRunning = false;

    const badges = [
        "Iniciante em Computação", "Explorador de Estruturas", "Mestre dos Algoritmos",
        "Arquiteto de Sistemas", "Engenheiro de Software", "Especialista em IA", "Cientista da Computação"
    ];

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
            showRegisterLink.classList.remove('hidden');
            showLoginLink.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            showRegisterLink.classList.add('hidden');
            showLoginLink.classList.remove('hidden');
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
        courseProgress = {}; // Reset progress
        earnedBadges = [];
        updateUIForAuthState();
        renderDashboard(); // Re-render to show locked state
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

            await loadProgressFromServer();
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
        // A small trick to log in right after registering
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = password;
        await handleLogin();
    };

const saveProgress = () => {
    const data = storage.getData();
    data.courses[courseName].progress = courseProgress;
    data.courses[courseName].badges = earnedBadges;
    storage.saveData(data);
};

    const loadProgressFromServer = async () => {
        if (!userToken) {
             // Load from local storage if not logged in
            courseProgress = JSON.parse(localStorage.getItem('courseProgress')) || {};
            earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
            renderDashboard();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/progress`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!res.ok) throw new Error('Could not fetch progress.');

            const serverProgress = await res.json();
            courseProgress = serverProgress.courseProgress || {};
            earnedBadges = serverProgress.earnedBadges || [];

            // Save to local storage as well for offline use/caching
            localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
            localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));

            renderDashboard();
        } catch (error) {
            console.error("Failed to load progress from server:", error);
            handleLogout(); // Log out if token is invalid or server fails
        }
    };

    // --- Logic ---
    const isCourseCompleted = (semesterIdx, courseIdx) => {
        const courseId = `s${semesterIdx}-c${courseIdx}`;
        return courseProgress[courseId] && courseProgress[courseId].main;
    };

    const isSemesterCompleted = (semesterIdx) => {
        return semesters[semesterIdx].courses.every((_, courseIdx) => isCourseCompleted(semesterIdx, courseIdx));
    };

    const checkAndAwardBadges = () => {
        semesters.forEach((_, semesterIdx) => {
            if (isSemesterCompleted(semesterIdx) && !earnedBadges.includes(badges[semesterIdx])) {
                earnedBadges.push(badges[semesterIdx]);
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            }
        });
        saveProgress();
    };

    // --- View Rendering ---
    const renderDashboard = () => {
        dashboardView.innerHTML = '';
        let isPreviousSemesterCompleted = true;

        semesters.forEach((semester, semesterIdx) => {
            const card = document.createElement('div');
            card.className = 'semester-card';
            card.dataset.semesterIndex = semesterIdx;

            let stateClass = '';
            const semesterCompleted = isSemesterCompleted(semesterIdx);

            if (semesterCompleted) {
                stateClass = 'completed';
            } else if (isPreviousSemesterCompleted) {
                stateClass = 'active';
                isPreviousSemesterCompleted = false;
            } else {
                stateClass = 'locked';
            }

            card.classList.add(stateClass);

            const courseListHTML = semester.courses.map((course, courseIdx) => {
                const isCompleted = isCourseCompleted(semesterIdx, courseIdx);
                return `<li class="${isCompleted ? 'completed-course' : ''}">${course.title}</li>`;
            }).join('');

            card.innerHTML = `
                <div class="semester-header">
                    <h2>${semester.semester}ª Etapa</h2>
                    <span class="status-indicator">${stateClass === 'completed' ? '✓' : (stateClass === 'locked' ? '🔒' : '▶')}</span>
                </div>
                <ul class="course-list">${courseListHTML}</ul>
            `;

            if (stateClass !== 'locked') {
                card.addEventListener('click', () => {
                    showCourseView(semesterIdx);
                });
            }

            dashboardView.appendChild(card);
        });
        checkAndAwardBadges();
    };

    const renderCourseView = (semesterIdx) => {
        const semester = semesters[semesterIdx];
        courseViewTitle.textContent = `${semester.semester}ª Etapa`;
        coursesGridContainer.innerHTML = '';

        semester.courses.forEach((course, courseIdx) => {
            const courseId = `s${semesterIdx}-c${courseIdx}`;
            if (!courseProgress[courseId]) {
                courseProgress[courseId] = { main: false, reading: false, notes: '' };
            }

            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <h3><a href="${course.url}" target="_blank">${course.title}</a></h3>
                <p class="course-prerequisites">Pré-requisitos: ${course.prerequisites}</p>
                <div class="checklist">
                    <label>
                        <input type="checkbox" data-type="main" ${courseProgress[courseId].main ? 'checked' : ''}>
                        Aula Principal
                    </label>
                    <label>
                        <input type="checkbox" data-type="reading" ${courseProgress[courseId].reading ? 'checked' : ''}>
                        Leitura Recomendada
                    </label>
                </div>
                <div class="notes-container">
                    <textarea class="quick-notes" placeholder="Suas anotações...">${courseProgress[courseId].notes}</textarea>
                </div>
            `;

            card.querySelector('.checklist').addEventListener('change', (e) => {
                const type = e.target.dataset.type;
                courseProgress[courseId][type] = e.target.checked;
                saveProgress();
                renderDashboard();
            });

            const notesArea = card.querySelector('.quick-notes');
            notesArea.addEventListener('keyup', () => {
                courseProgress[courseId].notes = notesArea.value;
                saveProgress();
            });

            coursesGridContainer.appendChild(card);
        });
        renderSchedule();
    };

    const renderSchedule = () => {
        const tableHTML = `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Dia da Semana</th>
                        <th>Semana 1: Introdução & Input</th>
                        <th>Semana 2: Processamento & Prática</th>
                        <th>Semana 3: Revisão & Conclusão</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>Segunda</strong></td><td>Aula 1 & 2 (Assista e Anote)</td><td>Prática 1 (Início dos exercícios/projeto)</td><td>Revisão Geral (Resumos)</td></tr>
                    <tr><td><strong>Terça</strong></td><td>Aula 3 & 4 (Assista e Anote)</td><td>Leitura Recomendada (Capítulo 1-2)</td><td>Reforço de Pré-requisitos</td></tr>
                    <tr><td><strong>Quarta</strong></td><td>Aula 5 + Revisão Rápida</td><td>Prática 2 (Desenvolvimento)</td><td>Mini-Teste/Simulado</td></tr>
                    <tr><td><strong>Quinta</strong></td><td>Início da Leitura Recomendada</td><td>Aprofundamento (Artigo/Tópico Extra)</td><td>Ajustes Finais (Checklist)</td></tr>
                    <tr><td><strong>Sexta</strong></td><td>Continuação da Leitura</td><td>Prática 3 (Finalização)</td><td>Preparação para a Próxima Matéria</td></tr>
                    <tr><td><strong>Sábado</strong></td><td>Revisão Completa da Semana 1</td><td>Revisão Global de Matérias Anteriores</td><td>Desbloqueio e Início da Nova Matéria</td></tr>
                    <tr><td><strong>Domingo</strong></td><td><strong>Descanso Total</strong></td><td><strong>Descanso Total</strong></td><td><strong>Descanso Total</strong></td></tr>
                </tbody>
            </table>
        `;
        scheduleContainer.innerHTML = '<h3><i class="fas fa-calendar-alt"></i> Cronograma Sugerido (3 semanas por matéria)</h3>' + tableHTML;
    };

    // --- Pomodoro Logic ---
    const updateTimerDisplay = () => {
        const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const seconds = (timerSeconds % 60).toString().padStart(2, '0');
        pomodoroTimerEl.textContent = `${minutes}:${seconds}`;
    };

    const startTimer = () => {
        if (isTimerRunning) return;
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                alert("Pomodoro concluído! Hora de uma pausa.");
                isTimerRunning = false;
            }
        }, 1000);
    };

    const pauseTimer = () => {
        isTimerRunning = false;
        clearInterval(timerInterval);
    };

    const resetTimer = () => {
        pauseTimer();
        timerSeconds = 1500;
        updateTimerDisplay();
    };

    // --- View Switching ---
    const showDashboard = () => {
        dashboardView.classList.remove('hidden');
        courseView.classList.add('hidden');
        dependencyView.classList.add('hidden');
        currentView = 'dashboard';
        currentSemesterIndex = -1;
        toggleViewBtn.innerHTML = '<i class="fas fa-project-diagram"></i> Ver Dependências';
        renderDashboard();
    };

    const showCourseView = (semesterIdx) => {
        dashboardView.classList.add('hidden');
        courseView.classList.remove('hidden');
        dependencyView.classList.add('hidden');
        currentSemesterIndex = semesterIdx;
        renderCourseView(semesterIdx);
    };

    const showDependencyView = () => {
        dashboardView.classList.add('hidden');
        courseView.classList.add('hidden');
        dependencyView.classList.remove('hidden');
        currentView = 'dependency';
        toggleViewBtn.innerHTML = '<i class="fas fa-th-large"></i> Ver Dashboard';
        renderDependencyGraph();
    };

    const renderDependencyGraph = () => {
        dependencyView.innerHTML = '<h2>Árvore de Dependências</h2>';
        const nodes = [];
        const links = [];
        const courseMap = new Map();
        semesters.forEach(semester => {
            semester.courses.forEach(course => {
                if (!courseMap.has(course.title)) {
                    nodes.push({ id: course.title, group: semester.semester });
                    courseMap.set(course.title, course.title);
                }
            });
        });
        const allCourseTitles = new Set(nodes.map(n => n.id));
        semesters.forEach(semester => {
            semester.courses.forEach(course => {
                if (course.prerequisites && course.prerequisites !== "N/A") {
                    const prereqs = course.prerequisites.split(',').map(p => p.trim());
                    prereqs.forEach(prereq => {
                        const foundPrereq = Array.from(allCourseTitles).find(title => title.includes(prereq));
                        if (foundPrereq) {
                            links.push({ source: foundPrereq, target: course.title });
                        }
                    });
                }
            });
        });
        const width = dependencyView.clientWidth || 1200;
        const height = 800;
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2.5));
        const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
        const link = svg.append("g").attr("stroke", "#999").attr("stroke-opacity", 0.6).selectAll("line").data(links).join("line").attr("stroke-width", 1.5);
        const node = svg.append("g").selectAll("g").data(nodes).join("g").call(drag(simulation));
        node.append("circle").attr("r", 12).attr("stroke", "#fff").attr("stroke-width", 1.5).attr("fill", d => d3.schemeCategory10[d.group % 10]);
        node.append("text").attr("x", 18).attr("y", "0.31em").text(d => d.id).attr("font-size", "12px").attr("fill", "#333");
        node.append("title").text(d => d.id);
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });
        function drag(simulation) {
          function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          }
          function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
          return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }
        dependencyView.append(svg.node());
    };

    // --- Event Listeners ---
    // Auth listeners
    loginBtn.addEventListener('click', () => openModal(true));
    registerBtn.addEventListener('click', () => openModal(false));
    closeModalBtn.addEventListener('click', closeModal);
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); openModal(false); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); openModal(true); });
    loginSubmitBtn.addEventListener('click', handleLogin);
    registerSubmitBtn.addEventListener('click', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    // App listeners
    backToDashboardBtn.addEventListener('click', showDashboard);
    toggleViewBtn.addEventListener('click', () => {
        if (currentView === 'dashboard') {
            showDependencyView();
        } else {
            showDashboard();
        }
    });
    // Pomodoro Listeners
    pomodoroStartBtn.addEventListener('click', startTimer);
    pomodoroPauseBtn.addEventListener('click', pauseTimer);
    pomodoroResetBtn.addEventListener('click', resetTimer);

    // --- Initial Load ---
    updateUIForAuthState();
    loadProgressFromServer();
    updateTimerDisplay();

    // --- Chatbot Logic ---
    const chatIcon = document.getElementById('chat-icon');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    let chatHistory = [];
    let isChatInitiated = false;
    const toggleChatWindow = () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden') && !isChatInitiated) {
            showWelcomeMessage();
            isChatInitiated = true;
        }
    };
    const addMessageToUI = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        if (sender === 'ai') {
            messageElement.innerHTML = marked.parse(message);
            messageElement.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        } else {
            messageElement.textContent = message;
        }
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    const showWelcomeMessage = () => {
        const welcomeText = "Olá! 👋 Sou seu tutor de IA. Como posso ajudar com seus estudos de Ciência da Computação hoje? Você pode me pedir para explicar um conceito, depurar um código ou sugerir recursos.";
        addMessageToUI(welcomeText, 'ai');
    };
    const handleSendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;
        addMessageToUI(message, 'user');
        chatInput.value = '';
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'ai-message', 'typing-indicator');
        typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        try {
            let context = "O aluno está na página principal do portal.";
            if (currentSemesterIndex !== -1) {
                const semester = semesters[currentSemesterIndex];
                const courseTitles = semester.courses.map(c => c.title).join(', ');
                context = `O aluno está visualizando a ${semester.semester}ª Etapa, que inclui os cursos: ${courseTitles}.`;
            }
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history: chatHistory, context })
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            chatHistory.push({ role: "user", parts: message });
            chatHistory.push({ role: "model", parts: data.reply });
            chatMessages.removeChild(typingIndicator);
            addMessageToUI(data.reply, 'ai');
        } catch (error) {
            console.error('Error sending message:', error);
            chatMessages.removeChild(typingIndicator);
            addMessageToUI('Desculpe, não consegui me conectar ao meu cérebro. Tente novamente.', 'ai');
        }
    };
    chatIcon.addEventListener('click', toggleChatWindow);
    closeChatBtn.addEventListener('click', toggleChatWindow);
    sendChatBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
});
