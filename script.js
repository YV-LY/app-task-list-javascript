// Отримуємо посилання на елементи DOM
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Функція для створення нового завдання з кнопкою видалення
function addTask() {
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Будь ласка, введіть текст завдання!");
        return;
    }

    // Створюємо елемент завдання (контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';

    // Наповнюємо його (класи task-checkmark та task-text для твого CSS)
    label.innerHTML = `
        <input type="checkbox">
        <span class="task-checkmark"></span>
        <span class="task-text">${taskText}</span>
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;

    // Додаємо подію для нової кнопки видалення
    const deleteBtn = label.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню чекбокса при натисканні на кнопку
        label.remove();
    });

    // Додаємо нове завдання в список
    taskList.appendChild(label);

    // Очищаємо поле вводу
    input.value = "";
    input.focus();
}

// Функція для обробки подій на СТАТИЧНИХ елементах (тих, що вже були в HTML)
function attachTaskEvents(label) {
    const deleteBtn = label.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            label.remove();
        });
    }
}

// Слухачі подій для кнопки та клавіші Enter
addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Навішуємо видалення на ті завдання, які вже були прописані в index.html
document.querySelectorAll('#task-list label').forEach(attachTaskEvents);