const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const goalInput = document.getElementById("goalInput");
const setGoalBtn = document.getElementById("setGoal");
const goalDisplay = document.getElementById("goalDisplay");

const themeToggle = document.getElementById("themeToggle");
const notes = document.getElementById("notes");

let tasks = [];
let completed = 0;

// Load saved data
chrome.storage.local.get(
  ["tasks", "completed", "dailyGoal", "notes", "theme"],
  (data) => {
    tasks = data.tasks || [];
    completed = data.completed || 0;

    renderTasks();
    document.getElementById("completedCount").textContent = completed;

    goalDisplay.textContent = data.dailyGoal || "";
    notes.value = data.notes || "";

    if (data.theme === "dark") {
      document.body.classList.add("dark");
    }
  }
);

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;

    li.onclick = () => {
      tasks.splice(index, 1);
      completed++;

      chrome.storage.local.set({
        tasks,
        completed
      });

      document.getElementById("completedCount").textContent = completed;
      renderTasks();
    };

    taskList.appendChild(li);
  });
}

// Add Task
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim()) {
    tasks.push(taskInput.value);

    chrome.storage.local.set({ tasks });

    taskInput.value = "";
    renderTasks();
  }
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  chrome.storage.local.set({ theme });
});

// Save Goal
setGoalBtn.addEventListener("click", () => {
  const goal = goalInput.value.trim();

  if (goal) {
    chrome.storage.local.set({ dailyGoal: goal });
    goalDisplay.textContent = goal;
    goalInput.value = "";
  }
});

// Save Notes
notes.addEventListener("input", () => {
  chrome.storage.local.set({
    notes: notes.value
  });
});

// Pomodoro Timer
let timeLeft = 1500;
let timerRunning = false;
let timer;

const timeDisplay = document.getElementById("time");

document.getElementById("startTimer").addEventListener("click", () => {
  if (timerRunning) return;

  timerRunning = true;

  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timerRunning = false;
      alert("Time's up!");
      timeLeft = 1500;
    } else {
      timeLeft--;

      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      timeDisplay.textContent =
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  }, 1000);
});