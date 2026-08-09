const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("taskList") || document.getElementById("list-container");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const emptyState = document.getElementById("emptyState");
const itemsLeftCount = document.getElementById("itemsLeftCount");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";


function applyFilter() {
    if (!listContainer) return;
    const tasks = listContainer.querySelectorAll("li");
    let visibleCount = 0;

    tasks.forEach(task => {
        const isCompleted = task.classList.contains("checked");
        if (currentFilter === "all") {
            task.style.display = "";
            visibleCount++;
        } else if (currentFilter === "active") {
            if (!isCompleted) {
                task.style.display = "";
                visibleCount++;
            } else {
                task.style.display = "none";
            }
        } else if (currentFilter === "completed") {
            if (isCompleted) {
                task.style.display = "";
                visibleCount++;
            } else {
                task.style.display = "none";
            }
        }
    });

    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.classList.remove("hidden");
            const emptyTextEl = emptyState.querySelector(".empty-text");
            const emptySubtextEl = emptyState.querySelector(".empty-subtext");
            
            if (tasks.length === 0) {
                if (emptyTextEl) emptyTextEl.textContent = "No tasks found!";
                if (emptySubtextEl) emptySubtextEl.textContent = "Add a task above to get started.";
            } else if (currentFilter === "active") {
                if (emptyTextEl) emptyTextEl.textContent = "No active tasks!";
                if (emptySubtextEl) emptySubtextEl.textContent = "All tasks are completed. Great job!";
            } else if (currentFilter === "completed") {
                if (emptyTextEl) emptyTextEl.textContent = "No completed tasks!";
                if (emptySubtextEl) emptySubtextEl.textContent = "Complete a task to see it here.";
            }
        } else {
            emptyState.classList.add("hidden");
        }
    }

    updateProgress();
}

function updateProgress() {
    if (!listContainer) return;
    const tasks = listContainer.querySelectorAll("li");
    const totalTasks = tasks.length;
    const completedTasks = listContainer.querySelectorAll("li.checked").length;
    const activeTasks = totalTasks - completedTasks;

    let percentage = 0;
    if (totalTasks > 0) {
        percentage = Math.round((completedTasks / totalTasks) * 100);
    }

    if (progressBar) {
        progressBar.style.width = percentage + "%";
    }
    if (progressText) {
        progressText.textContent = percentage + "% Completed";
    }

    if (itemsLeftCount) {
        itemsLeftCount.textContent = `${activeTasks} task${activeTasks === 1 ? '' : 's'} left`;
    }
}

function addTask() {
    if (inputBox.value.trim() === '') {
        alert("You must write something!");
        return;
    }
    let li = document.createElement("li");
    li.textContent = inputBox.value.trim();
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    listContainer.appendChild(li);
    inputBox.value = "";
    saveData();
    applyFilter();
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        applyFilter();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        applyFilter();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
    applyFilter();
}
showTask();

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        applyFilter();
    });
});

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
        const completedTasks = listContainer.querySelectorAll("li.checked");
        if (completedTasks.length === 0) return;
        completedTasks.forEach(task => task.remove());
        saveData();
        applyFilter();
    });
}


const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.checked = true;
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.checked = false;
}

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Date

const currentDateEl = document.getElementById('currentDate');

function displayCurrentDate() {
    if (!currentDateEl) return;
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
});
