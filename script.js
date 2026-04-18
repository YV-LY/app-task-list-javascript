// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTaskList);

// Функція для додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskListElement(taskText, false);
    saveTaskList();

    taskInput.value = "";
    taskInput.focus();
}

// Функція для створення елемента та додавання його в DOM
function createTaskListElement(taskText, isCompleted) {
    const label = document.createElement('label');
    label.className = 'task-list-item';

    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-delete-btn" title="Видалити завдання">✖</button>
    `;

    // Призначаємо події для нового елемента
    attachTaskListEvents(label);

    taskList.appendChild(label);
}

// Функція для обробки подій на елементах списку
function attachTaskListEvents(label) {
    const textSpan = label.querySelector('.task-text');

    // Зберігаємо зміни при втраті фокусу (blur)
    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання";
        }
        saveTaskList();
    });

    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            textSpan.blur();
        }
    });

    // Подія для чекбокса
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList();
    });

    // Подія для кнопки видалення
    const taskDeleteBtn = label.querySelector('.task-delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        label.remove();
        saveTaskList();
    });
}

// Збереження у LocalStorage
function saveTaskList() {
    const myTaskList = [];
    document.querySelectorAll('.task-list-item').forEach(item => {
        myTaskList.push({
            text: item.querySelector('.task-text').innerText,
            completed: item.querySelector('input').checked
        });
    });
    localStorage.setItem('myTaskList', JSON.stringify(myTaskList));
}

// Завантаження з LocalStorage
function loadTaskList() {
    const savedData = localStorage.getItem('myTaskList');
    if (savedData) {
        const myTaskList = JSON.parse(savedData);
        // Очищуємо список перед завантаженням (якщо там були статичні елементи)
        taskList.innerHTML = "";
        myTaskList.forEach(task => {
            createTaskListElement(task.text, task.completed);
        });
    }
}

// Слухачі подій для кнопки та поля вводу
taskAddBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});