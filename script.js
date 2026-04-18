//  Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); 
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTaskList);


function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskListElement(taskText, false);
    saveTaskList();

    taskInput.value = "";
    taskInput.focus();
}

//  Функція для створення елемента
function createTaskListElement(taskText, isCompleted) {
    const label = document.createElement('label');
    label.className = 'task-list-item';

    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''} >
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-edit-btn" title="Редагувати завдання">✏️</button>
        <button class="task-done-btn" title="Змінити відмітку виконання завдання">✔</button>                
        <button class="task-delete-btn" title="Видалити завдання">✖</button>
    `;

    // Навішуємо всі події на новий елемент
    attachTaskListEvents(label);

    taskList.appendChild(label);
}


function attachTaskListEvents(label) {
    const textSpan = label.querySelector('.task-text');
    const checkbox = label.querySelector('input');
    const taskEditBtn = label.querySelector('.task-edit-btn');
    const taskDoneBtn = label.querySelector('.task-done-btn');
    const taskDeleteBtn = label.querySelector('.task-delete-btn');

    // Редагування: при фокусі змінюємо іконку на дискету
    textSpan.addEventListener('focus', () => {
        label.classList.add('editing');
        taskEditBtn.innerText = '💾';
        taskEditBtn.title = 'Зберегти зміни';
    });

    // Збереження при втраті фокусу (blur)
    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання";
        }
        label.classList.remove('editing');
        taskEditBtn.innerText = '✏️';
        taskEditBtn.title = "Редагувати завдання";
        saveTaskList();
    });

    // Enter для збереження
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

    // Чекбокс
    checkbox.addEventListener('change', () => {
        saveTaskList();
    });

    // Кнопка Видалити
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        label.remove();
        saveTaskList();
    });

    // Кнопка Виконати
    taskDoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        saveTaskList();
    });

    // Кнопка Редагувати (клік на олівець/дискету)
    taskEditBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (document.activeElement === textSpan) {
            textSpan.blur();
        } else {
            textSpan.focus();
        }
    });
}

//  Збереження у LocalStorage
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

//  Завантаження
function loadTaskList() {
    // Видаляємо статичні завдання
    document.querySelectorAll('.task-list-item').forEach(item => item.remove());

    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        myTaskList.forEach(task => {
            createTaskListElement(task.text, task.completed);
        });
    }
}


taskAddBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});