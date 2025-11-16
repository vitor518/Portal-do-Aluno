document.addEventListener('DOMContentLoaded', () => {
    const semestersContainer = document.getElementById('semesters-container');
    let courseProgress = JSON.parse(localStorage.getItem('courseProgress')) || {};

    const saveProgress = () => {
        localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
    };

    const isSemesterUnlocked = (semesterIndex) => {
        if (semesterIndex === 0) {
            return true; // O primeiro semestre é sempre desbloqueado
        }

        const previousSemester = semesters[semesterIndex - 1];
        return previousSemester.courses.every((_, courseIndex) => {
            const courseId = `s${semesterIndex - 1}-c${courseIndex}`;
            return courseProgress[courseId];
        });
    };

    const renderSemesters = () => {
        semestersContainer.innerHTML = ''; // Limpa o container para re-renderizar

        semesters.forEach((semester, semesterIndex) => {
            const semesterCard = document.createElement('div');
            semesterCard.classList.add('semester-card');

            const unlocked = isSemesterUnlocked(semesterIndex);
            if (!unlocked) {
                semesterCard.classList.add('locked');
            }

            const semesterTitle = document.createElement('h2');
            semesterTitle.classList.add('semester-title');
            semesterTitle.textContent = `${semester.semester}ª Etapa`;
            semesterCard.appendChild(semesterTitle);

            const coursesGrid = document.createElement('div');
            coursesGrid.classList.add('courses-grid');

            semester.courses.forEach((course, courseIndex) => {
                const courseId = `s${semesterIndex}-c${courseIndex}`;

                const courseCard = document.createElement('div');
                courseCard.classList.add('course-card');

                const courseInfo = document.createElement('div');
                courseInfo.classList.add('course-info');

                const courseLink = document.createElement('a');
                courseLink.href = course.url;
                courseLink.textContent = course.title;
                courseLink.target = '_blank'; // Abrir em nova aba

                const coursePrerequisites = document.createElement('p');
                coursePrerequisites.classList.add('course-prerequisites');
                coursePrerequisites.textContent = `Pré-requisitos: ${course.prerequisites}`;

                courseInfo.appendChild(courseLink);
                courseInfo.appendChild(coursePrerequisites);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('completion-checkbox');
                checkbox.id = courseId;
                checkbox.checked = courseProgress[courseId] || false;

                if(!unlocked) {
                    checkbox.disabled = true;
                }

                checkbox.addEventListener('change', () => {
                    courseProgress[courseId] = checkbox.checked;
                    saveProgress();
                    renderSemesters(); // Re-renderizar para atualizar o estado de bloqueio
                });

                courseCard.appendChild(courseInfo);
                courseCard.appendChild(checkbox);
                coursesGrid.appendChild(courseCard);
            });

            semesterCard.appendChild(coursesGrid);
            semestersContainer.appendChild(semesterCard);
        });
    };

    renderSemesters();
});
