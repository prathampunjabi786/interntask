document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    addTaskButton.addEventListener("click", addTask);
    taskList.addEventListener("click", manageTasks);

    loadTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const task = {
            text: taskText,
            id: Date.now(),
        };

        const tasks = getStoredTasks();
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        taskInput.value = "";
        taskInput.focus();

        displayTasks();
    }

    function getStoredTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        return tasks;
    }

    function displayTasks() {
        const tasks = getStoredTasks();
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button class="delete" data-id="${task.id}">Delete</button>
                <button class="edit" data-id="${task.id}">Edit</button>
            `;
            taskList.appendChild(taskItem);
        });
    }

    function manageTasks(event) {
        if (event.target.classList.contains("delete")) {
            const taskId = event.target.getAttribute("data-id");
            deleteTask(taskId);
        } else if (event.target.classList.contains("edit")) {
            const taskId = event.target.getAttribute("data-id");
            editTask(taskId);
        } else if (event.target.classList.contains("save")) {
            const taskId = event.target.getAttribute("data-id");
            saveTask(taskId);
        }
    }

    function deleteTask(id) {
        const tasks = getStoredTasks();
        const updatedTasks = tasks.filter((task) => task.id !== parseInt(id));
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        displayTasks();
    }

    function editTask(id) {
        const tasks = getStoredTasks();
        const task = tasks.find((t) => t.id === parseInt(id));

        const taskItem = document.querySelector(`[data-id="${id}"]`);
        taskItem.innerHTML = `
            <input type="text" id="editTaskInput" value="${task.text}">
            <button class="save" data-id="${id}">Save</button>
        `;
    }

    function saveTask(id) {
        const updatedText = document.getElementById("editTaskInput").value;
        const tasks = getStoredTasks();
        const updatedTasks = tasks.map((task) => {
            if (task.id === parseInt(id)) {
                task.text = updatedText;
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        displayTasks();
    }

    function loadTasks() {
        if (localStorage.getItem("tasks")) {
            displayTasks();
        }
    }
});