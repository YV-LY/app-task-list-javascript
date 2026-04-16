// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); // ID з твого index.html
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTaskList);

// Функція для додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskListElement(taskText, false);
    saveTaskList(); // Зберігаємо після додавання

    taskInput.value = "";
    taskInput.focus();
}

// Створення елемента списку
function createTaskListElement(taskText, isCompleted) {
    const label = document.createElement('label');
    label.className = 'task-list-item';

    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text">${taskText}</span>
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;

    // Подія для checkbox
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList();
    });

    // Подія для кнопки видалення
    const deleteBtn = label.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        label.remove();
        saveTaskList(); // Зберігаємо після видалення
    });

    taskList.appendChild(label);
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
    // Видаляємо статичні завдання, щоб вони не дублювалися
    const staticItems = document.querySelectorAll('.task-list-item');
    staticItems.forEach(item => item.remove());

    const savedData = localStorage.getItem('myTaskList');
    if (savedData) {
        const myTaskList = JSON.parse(savedData);
        myTaskList.forEach(task => {
            createTaskListElement(task.text, task.completed);
        });
    }
}

// Слухачі подій
taskAddBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});