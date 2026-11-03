// ===== Focus Board: Day 3 (Blocks 1-4) =====

// --- Elements ---
const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#search");
const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const titleError = document.querySelector("#title-error");
const statusEl = document.querySelector("#status");
const filtersEl = document.querySelector("#filters");

if (!taskList || !searchInput || !taskForm || !titleInput || !titleError || !statusEl || !filtersEl) {
  throw new Error("Required elements are missing from index.html");
}

// --- Constants ---
const STORAGE_KEY = "jsSprint.tasks.v1";
const MAX_TITLE_LENGTH = 80;
const VALID_PRIORITIES = ["high", "medium", "low"];
const SAMPLE_TASKS = [
  { id: 1, title: "Read brief", completed: false, priority: "high" },
  { id: 2, title: "Draft outline", completed: true, priority: "medium" },
  { id: 3, title: "Write tests", completed: false, priority: "high" },
  { id: 4, title: "Review pull request", completed: false, priority: "low" },
  { id: 5, title: "Update README", completed: true, priority: "medium" }
];

// --- State ---
let uiTasks = SAMPLE_TASKS.map(task => ({ ...task }));
let currentStatus = "all";

// --- Pure logic ---
function filterByQuery(tasks, query) {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") return tasks;
  return tasks.filter(task => task.title.toLowerCase().includes(normalized));
}

function getVisibleTasks(tasks, query, status) {
  const byQuery = filterByQuery(tasks, query);
  if (status === "open") return byQuery.filter(task => !task.completed);
  if (status === "completed") return byQuery.filter(task => task.completed);
  return byQuery;
}

function toggleTask(tasks, id) {
  return tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
}

function deleteTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

function addTask(tasks, title, priority) {
  const nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  return [...tasks, { id: nextId, title, completed: false, priority }];
}

function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

function validateTaskInput(input, existingTasks) {
  const errors = {};
  const title = String(input.title ?? "").trim();
  const priority = String(input.priority ?? "");

  if (title.length === 0) {
    errors.title = "Please enter a task title.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  } else if (existingTasks.some(t => normalizeTitle(t.title) === normalizeTitle(title))) {
    errors.title = "A task with this title already exists.";
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    errors.priority = "Please choose a valid priority.";
  }

  const ok = Object.keys(errors).length === 0;
  return { ok, value: ok ? { title, priority } : null, errors };
}

// --- Storage ---
function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Save failed", error);
    return false;
  }
}

function isValidStoredTask(task) {
  return task !== null
    && typeof task === "object"
    && Number.isInteger(task.id)
    && typeof task.title === "string" && task.title.trim() !== ""
    && typeof task.completed === "boolean"
    && VALID_PRIORITIES.includes(task.priority);
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { tasks: null, notice: "" };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isValidStoredTask)) {
      throw new Error("Stored data has an unexpected shape");
    }
    return { tasks: parsed, notice: "" };
  } catch (error) {
    console.error("Load failed", error);
    return { tasks: [], notice: "Saved data could not be read, so the list was reset." };
  }
}

function persist() {
  if (!saveTasks(uiTasks)) {
    statusEl.textContent = "Could not save. Your changes will be lost on refresh.";
  }
}

// --- Rendering ---
function createTaskItem(task) {
  const li = document.createElement("li");
  li.dataset.taskId = task.id;
  if (task.completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.id = `task-${task.id}`;
  checkbox.dataset.action = "toggle";
  checkbox.dataset.taskId = task.id;

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = task.title;

  const badge = document.createElement("span");
  badge.className = `priority priority-${task.priority}`;
  badge.textContent = task.priority;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.taskId = task.id;
  deleteBtn.textContent = "Delete";

  li.append(checkbox, label, badge, deleteBtn);
  return li;
}

function renderTasks(visibleTasks) {
  taskList.replaceChildren();
  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = uiTasks.length === 0 ? "No tasks yet." : "No tasks match your search.";
    taskList.append(empty);
    return;
  }
  visibleTasks.forEach(task => taskList.append(createTaskItem(task)));
}

function render() {
  renderTasks(getVisibleTasks(uiTasks, searchInput.value, currentStatus));
}

function showTitleError(message) {
  titleError.textContent = message;
  titleInput.setAttribute("aria-invalid", "true");
}

function clearTitleError() {
  titleError.textContent = "";
  titleInput.removeAttribute("aria-invalid");
}

// --- Events ---
taskList.addEventListener("click", event => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const id = Number(control.dataset.taskId);
  if (!Number.isInteger(id)) return;

  if (control.dataset.action === "toggle") uiTasks = toggleTask(uiTasks, id);
  if (control.dataset.action === "delete") uiTasks = deleteTask(uiTasks, id);
  persist();
  render();
});

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(taskForm);
  const result = validateTaskInput(
    { title: data.get("title"), priority: data.get("priority") },
    uiTasks
  );

  if (!result.ok) {
    statusEl.textContent = "";
    showTitleError(result.errors.title ?? result.errors.priority);
    titleInput.focus();
    return;
  }

  uiTasks = addTask(uiTasks, result.value.title, result.value.priority);
  const saved = saveTasks(uiTasks);
  clearTitleError();
  taskForm.reset();
  titleInput.focus();
  statusEl.textContent = saved
    ? `Added "${result.value.title}".`
    : `Added "${result.value.title}", but it could not be saved.`;
  render();
});

titleInput.addEventListener("input", clearTitleError);

filtersEl.addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  currentStatus = button.dataset.filter;
  filtersEl.querySelectorAll("button").forEach(b =>
    b.setAttribute("aria-pressed", String(b === button))
  );
  render();
});

searchInput.addEventListener("input", render);

// --- Start the app (keep this LAST) ---
const stored = loadTasks();
if (stored.tasks !== null) uiTasks = stored.tasks;
if (stored.notice) statusEl.textContent = stored.notice;
render();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Pending
const p = wait(1000);
console.log("1. just created:", p);

// Fulfilled (after 1 second)
p.then(() => console.log("3. after 1 second:", p));

console.log("2. this line runs before the promise finishes");

loadSuggestions()
  .then((items) => console.log("Suggestions:", items))
  .catch((error) => console.log("Failed:", error.message));
import { loadSuggestions } from "./api.js";
