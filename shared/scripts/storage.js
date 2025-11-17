/**
 * Sistema Unificado de Armazenamento
 * Gerencia progresso de múltiplos cursos
 */

class UniversidadeStorage {
    constructor() {
        this.storageKey = 'universidade_livre_data';
        this.init();
    }

    // Inicializa estrutura de dados
    init() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                userId: this.generateUserId(),
                profile: {
                    name: '',
                    joinDate: new Date().toISOString(),
                    totalHoursStudied: 0,
                    streak: 0,
                    lastAccessDate: new Date().toISOString()
                },
                courses: {
                    'ciencia-computacao': this.getEmptyCourseData(),
                    'matematica': this.getEmptyCourseData()
                },
                globalBadges: [],
                pomodoroSessions: []
            };
            this.saveData(initialData);
        }
    }

    // Estrutura vazia de curso
    getEmptyCourseData() {
        return {
            currentSemester: 0,
            progress: {},
            badges: [],
            notes: {},
            lastAccess: null,
            completedSemesters: [],
            timeSpent: 0
        };
    }

    // Gera ID único do usuário
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Recupera todos os dados
    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    // Salva dados
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Atualiza progresso de um curso específico
    updateCourseProgress(courseName, semesterIdx, courseIdx, progressData) {
        const data = this.getData();
        const courseId = `s${semesterIdx}-c${courseIdx}`;

        if (!data.courses[courseName].progress[courseId]) {
            data.courses[courseName].progress[courseId] = {
                main: false,
                reading: false,
                notes: ''
            };
        }

        // Atualiza progresso
        Object.assign(data.courses[courseName].progress[courseId], progressData);

        // Atualiza última data de acesso
        data.courses[courseName].lastAccess = new Date().toISOString();
        data.profile.lastAccessDate = new Date().toISOString();

        this.saveData(data);
        return data;
    }

    // Obtém progresso de um curso
    getCourseProgress(courseName) {
        const data = this.getData();
        return data.courses[courseName] || this.getEmptyCourseData();
    }

    // Adiciona badge
    addBadge(courseName, badgeName) {
        const data = this.getData();

        // Badge do curso específico
        if (!data.courses[courseName].badges.includes(badgeName)) {
            data.courses[courseName].badges.push(badgeName);
        }

        // Badge global (se for especial)
        if (this.isGlobalBadge(badgeName) && !data.globalBadges.includes(badgeName)) {
            data.globalBadges.push(badgeName);
        }

        this.saveData(data);
        return data;
    }

    // Verifica se é badge global (ex: completou 2 cursos)
    isGlobalBadge(badgeName) {
        const globalBadges = ['Mestre Multidisciplinar', 'Cientista Completo'];
        return globalBadges.includes(badgeName);
    }

    // Registra sessão Pomodoro
    addPomodoroSession(courseName, minutes) {
        const data = this.getData();
        const session = {
            course: courseName,
            minutes: minutes,
            date: new Date().toISOString()
        };

        data.pomodoroSessions.push(session);
        data.courses[courseName].timeSpent += minutes;
        data.profile.totalHoursStudied += minutes / 60;

        this.saveData(data);
        return data;
    }

    // Obtém estatísticas globais
    getGlobalStats() {
        const data = this.getData();

        let totalCoursesCompleted = 0;
        let totalBadges = data.globalBadges.length;
        let totalDisciplinesCompleted = 0;

        Object.keys(data.courses).forEach(courseName => {
            const course = data.courses[courseName];
            totalBadges += course.badges.length;

            // Conta disciplinas completas
            Object.keys(course.progress).forEach(courseId => {
                if (course.progress[courseId].main) {
                    totalDisciplinesCompleted++;
                }
            });

            // Verifica se curso está completo
            if (course.completedSemesters.length > 0) {
                totalCoursesCompleted++;
            }
        });

        return {
            totalCoursesCompleted,
            totalBadges,
            totalDisciplinesCompleted,
            totalHoursStudied: Math.round(data.profile.totalHoursStudied),
            streak: data.profile.streak,
            joinDate: data.profile.joinDate
        };
    }

    // Atualiza streak de dias consecutivos
    updateStreak() {
        const data = this.getData();
        const today = new Date().toDateString();
        const lastAccess = new Date(data.profile.lastAccessDate).toDateString();

        if (today !== lastAccess) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastAccess === yesterday.toDateString()) {
                // Dia consecutivo
                data.profile.streak++;
            } else {
                // Quebrou a sequência
                data.profile.streak = 1;
            }
        }

        data.profile.lastAccessDate = new Date().toISOString();
        this.saveData(data);
        return data.profile.streak;
    }

    // Exporta dados (backup)
    exportData() {
        const data = this.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `universidade_livre_backup_${Date.now()}.json`;
        a.click();
    }

    // Importa dados (restaurar backup)
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveData(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Reseta tudo (cuidado!)
    resetAll() {
        if (confirm('Tem certeza? Isso apagará TODO seu progresso!')) {
            localStorage.removeItem(this.storageKey);
            this.init();
            return true;
        }
        return false;
    }
}

// Instância global
const storage = new UniversidadeStorage();
