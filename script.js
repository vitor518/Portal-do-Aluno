document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dashboardView = document.getElementById('dashboard-view');
    const courseView = document.getElementById('course-view');
    const dependencyView = document.getElementById('dependency-view');
    const courseViewTitle = document.getElementById('course-view-title');
    const coursesGridContainer = document.getElementById('courses-grid-container');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const toggleViewBtn = document.getElementById('toggle-view-btn');
    const scheduleContainer = document.getElementById('schedule-container');

    // Pomodoro Elements
    const pomodoroTimerEl = document.getElementById('pomodoro-timer');
    const pomodoroStartBtn = document.getElementById('pomodoro-start');
    const pomodoroPauseBtn = document.getElementById('pomodoro-pause');
    const pomodoroResetBtn = document.getElementById('pomodoro-reset');

    // State
    let courseProgress = JSON.parse(localStorage.getItem('courseProgress')) || {};
    let earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    let currentView = 'dashboard';

    // Pomodoro State
    let timerInterval;
    let timerSeconds = 1500; // 25 minutes
    let isTimerRunning = false;

    const badges = [
        "Iniciante em Computação", "Explorador de Estruturas", "Mestre dos Algoritmos",
        "Arquiteto de Sistemas", "Engenheiro de Software", "Especialista em IA", "Cientista da Computação"
    ];

    // --- State Management ---
    const saveProgress = () => {
        localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
        localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
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
                // Trigger confetti celebration
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 }
                });
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

            let icon = '', statusText = '', stateClass = '';

            const semesterCompleted = isSemesterCompleted(semesterIdx);

            if (semesterCompleted) {
                icon = '<i class="fas fa-check-circle"></i>';
                statusText = '100% Concluído';
                stateClass = 'completed';
            } else if (isPreviousSemesterCompleted) {
                icon = '<i class="fas fa-rocket"></i>';
                statusText = 'Iniciar / Continuar';
                stateClass = 'active';

                // Check if it was previously locked to add unlock animation
                const wasLocked = card.classList.contains('locked');
                if(wasLocked) {
                    card.classList.add('newly-unlocked');
                }

                isPreviousSemesterCompleted = false;
            } else {
                icon = '<i class="fas fa-lock"></i>';
                statusText = 'Bloqueado';
                stateClass = 'locked';
            }

            card.classList.add(stateClass);
            const completedCourses = semester.courses.filter((_, courseIdx) => isCourseCompleted(semesterIdx, courseIdx)).length;
            const totalCourses = semester.courses.length;
            const progressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

            card.innerHTML = `
                <h2>${semester.semester}ª Etapa</h2>
                <div class="status-icon">${icon}</div>
                <p class="status-text">${statusText}</p>
                ${(stateClass === 'completed' && earnedBadges.includes(badges[semesterIdx])) ? `<div class="badge-award"><i class="fas fa-medal"></i> ${badges[semesterIdx]}</div>` : ''}
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                </div>
            `;

            if (stateClass !== 'locked') {
                card.addEventListener('click', () => showCourseView(semesterIdx));
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

    pomodoroStartBtn.addEventListener('click', startTimer);
    pomodoroPauseBtn.addEventListener('click', pauseTimer);
    pomodoroResetBtn.addEventListener('click', resetTimer);

    // --- View Switching ---
    const showDashboard = () => {
        dashboardView.classList.remove('hidden');
        courseView.classList.add('hidden');
        dependencyView.classList.add('hidden');
        currentView = 'dashboard';
        toggleViewBtn.innerHTML = '<i class="fas fa-project-diagram"></i> Ver Dependências';
        renderDashboard();
    };

    const showCourseView = (semesterIdx) => {
        dashboardView.classList.add('hidden');
        courseView.classList.remove('hidden');
        dependencyView.classList.add('hidden');
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

        semesters.forEach((semester) => {
            semester.courses.forEach((course) => {
                const courseTitle = course.title;
                if (!courseMap.has(courseTitle)) {
                    nodes.push({ id: courseTitle, group: semester.semester });
                    courseMap.set(courseTitle, courseTitle);
                }
            });
        });

        const allCourseTitles = new Set(nodes.map(n => n.id));

        semesters.forEach((semester) => {
            semester.courses.forEach((course) => {
                const courseTitle = course.title;
                if (course.prerequisites && course.prerequisites !== "N/A") {
                    const prereqs = course.prerequisites.split(',').map(p => p.trim());
                    prereqs.forEach(prereq => {
                        // Find the full title of the prerequisite
                        const foundPrereq = Array.from(allCourseTitles).find(title => title.includes(prereq));
                        if (foundPrereq) {
                            links.push({ source: foundPrereq, target: courseTitle });
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

        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1.5);

        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(drag(simulation));

        node.append("circle")
            .attr("r", 12)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("fill", d => d3.schemeCategory10[d.group % 10]);

        node.append("text")
            .attr("x", 18)
            .attr("y", "0.31em")
            .text(d => d.id)
            .attr("font-size", "12px")
            .attr("fill", "#333");

        node.append("title")
            .text(d => d.id);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
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

          return d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
        }

        dependencyView.append(svg.node());
    };

    // --- Event Listeners ---
    backToDashboardBtn.addEventListener('click', showDashboard);
    toggleViewBtn.addEventListener('click', () => {
        if (currentView === 'dashboard') {
            showDependencyView();
        } else {
            showDashboard();
        }
    });

    // --- Initial Load ---
    updateTimerDisplay();
    showDashboard();
});
