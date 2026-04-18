// 1. Отримуємо посилання на елементи DOM (виправлено назви під твій HTML)
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); // Змінено з task-add-btn на add-btn
const taskList = document.getElementById('task-list');

// 2. Завантажуємо дані при старті
document.addEventListener('DOMContentLoaded', loadTaskList);

// 3. Головна функція для додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskListElement(taskText, false);
    saveTaskList();

    taskInput.value = "";
    taskInput.focus();
}

// 4. Створення елемента списку (повністю за методичкою крок 93)
function createTaskListElement(taskText, isCompleted) {
    const label = document.createElement('label');
    label.className = 'task-list-item';

    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''} >
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-done-btn" title="Змінити відмітку виконання завдання">✔</button>                
        <button class="task-delete-btn" title="Видалити завдання">✖</button>
    `;

    const textSpan = label.querySelector('.task-text');
    const checkbox = label.querySelector('input');

    // Зберігання при втраті фокусу
    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання";
        }
        saveTaskList();
    });

    // Зберігання при Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            textSpan.blur();
        }
    });

    // Блокування перемикання чекбокса при кліку на текст
    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    // Зміна стану чекбокса (галочка)
    checkbox.addEventListener('change', () => {
        saveTaskList();
    });

    // Кнопка Видалити
    const taskDeleteBtn = label.querySelector('.task-delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        label.remove();
        saveTaskList();
    });

    // Кнопка Виконати (галочка)
    const taskDoneBtn = label.querySelector('.task-done-btn');
    taskDoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        saveTaskList();
    });

    taskList.appendChild(label);
}

// 5. Збереження у LocalStorage
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

// 6. Завантаження з LocalStorage
function loadTaskList() {
    // Видаляємо статичні елементи, щоб не дублювалися
    const staticTaskList = document.querySelectorAll('.task-list-item');
    staticTaskList.forEach(item => item.remove());

    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        myTaskList.forEach(task => {
            createTaskListElement(task.text, task.completed);
        });
    }
}

// 7. Слухачі подій для головної кнопки додавання
taskAddBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});