
// ==========================================
// 1. ADVANCED ACADEMIC PLANNER FUNCTIONALITY
// ==========================================

(function () {

    const plannerForm = document.getElementById("plannerForm");
    const taskInput = document.getElementById("taskInput");
    const taskSubject = document.getElementById("taskSubject");
    const taskDueDate = document.getElementById("taskDueDate");
    const taskPriority = document.getElementById("taskPriority");

    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");

    const progressCircle = document.getElementById("progressCircle");
    const progressPercentage = document.getElementById("progressPercentage");
    const progressMessage = document.getElementById("progressMessage");

    const currentDate = document.getElementById("currentDate");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");

    const filterButtons = document.querySelectorAll(".filter-btn");

    // Stop if this is not the Academic Planner page
    if (!plannerForm || !taskList) return;

    // Load saved tasks
    let tasks = [];

    try {
        tasks = JSON.parse(localStorage.getItem("academicTasks")) || [];
    } catch (error) {
        tasks = [];
    }

    let currentFilter = "all";

    // Display today's date
    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    }

    // Save tasks in browser storage
    function saveTasks() {
        localStorage.setItem("academicTasks", JSON.stringify(tasks));
    }

    // Format due dates
    function formatDate(date) {
        if (!date) return "No due date";

        return new Date(date + "T00:00:00").toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }

    // Display tasks
    function displayTasks() {

        taskList.innerHTML = "";

        let filteredTasks = tasks;

        if (currentFilter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (currentFilter === "done") {
            filteredTasks = tasks.filter(task => task.completed);
        }

        if (filteredTasks.length === 0) {

            const emptyMessage = document.createElement("li");

            emptyMessage.id = "emptyMessage";

            emptyMessage.textContent =
                tasks.length === 0
                    ? "No tasks added yet. Start planning your academic activities!"
                    : "No tasks found in this category.";

            taskList.appendChild(emptyMessage);

        } else {

            filteredTasks.forEach(function (task) {

                const listItem = document.createElement("li");

                listItem.className = "task-item";

                if (task.completed) {
                    listItem.classList.add("completed");
                }

                // Task information
                const details = document.createElement("div");
                details.className = "task-details";

                const name = document.createElement("h3");
                name.textContent = task.name;

                const subject = document.createElement("span");
                subject.textContent = task.subject;

                const dueDate = document.createElement("p");
                dueDate.textContent = "Due: " + formatDate(task.dueDate);

                const priority = document.createElement("span");
                priority.textContent = task.priority + " Priority";
                priority.className = "task-priority " +
                    task.priority.toLowerCase();

                details.appendChild(name);
                details.appendChild(subject);
                details.appendChild(dueDate);
                details.appendChild(priority);

                // Action buttons
                const actions = document.createElement("div");
                actions.className = "task-actions";

                const completeButton = document.createElement("button");

                completeButton.type = "button";

                completeButton.textContent =
                    task.completed ? "Undo" : "Complete";

                completeButton.className = "complete-task-btn";

                completeButton.addEventListener("click", function () {

                    task.completed = !task.completed;

                    saveTasks();
                    displayTasks();

                });

                const deleteButton = document.createElement("button");

                deleteButton.type = "button";
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-task-btn";

                deleteButton.addEventListener("click", function () {

                    tasks = tasks.filter(item => item.id !== task.id);

                    saveTasks();
                    displayTasks();

                });

                actions.appendChild(completeButton);
                actions.appendChild(deleteButton);

                listItem.appendChild(details);
                listItem.appendChild(actions);

                taskList.appendChild(listItem);

            });
        }

        updateProgress();
    }

    // Add a new task
    plannerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = taskInput.value.trim();

        if (name === "") {
            alert("Please enter an academic task.");
            return;
        }

        const newTask = {
            id: Date.now() + Math.random(),
            name: name,
            subject: taskSubject.value,
            dueDate: taskDueDate.value,
            priority: taskPriority.value,
            completed: false
        };

        tasks.push(newTask);

        saveTasks();

        plannerForm.reset();

        displayTasks();

    });

    // Filter tasks
    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentFilter = button.dataset.filter;

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            displayTasks();

        });

    });

    // Clear completed tasks
    if (clearCompletedBtn) {

        clearCompletedBtn.addEventListener("click", function () {

            tasks = tasks.filter(task => !task.completed);

            saveTasks();

            displayTasks();

        });

    }

    // Update academic progress
    function updateProgress() {

        const total = tasks.length;

        const completed = tasks.filter(
            task => task.completed
        ).length;

        const pending = total - completed;

        const percentage = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        if (taskCount) {
            taskCount.textContent =
                total + (total === 1 ? " Task" : " Tasks");
        }

        if (totalTasks) totalTasks.textContent = total;

        if (completedTasks) completedTasks.textContent = completed;

        if (pendingTasks) pendingTasks.textContent = pending;

        if (progressPercentage) {
            progressPercentage.textContent = percentage + "%";
        }

        if (progressCircle) {

            const degrees = percentage * 3.6;

            progressCircle.style.background =
                `conic-gradient(#8060f5 ${degrees}deg, #1c2335 ${degrees}deg)`;

        }

        if (progressMessage) {

            if (total === 0) {
                progressMessage.textContent =
                    "Every completed task brings you closer to your goals.";
            } else if (percentage === 100) {
                progressMessage.textContent =
                    "Excellent! You have completed all your tasks.";
            } else {
                progressMessage.textContent =
                    "You have completed " + percentage +
                    "% of your academic tasks. Keep going!";
            }

        }
    }

    // Display saved tasks when the page opens
    displayTasks();

})();

// ==========================================
// 2. CONTACT FORM VALIDATION
// ==========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        const feedback = document.getElementById("formFeedback");

        // Check for empty fields
        if (
            name === "" ||
            email === "" ||
            phone === "" ||
            message === ""
        ) {

            feedback.textContent = "Please fill in all fields.";
            feedback.style.color = "red";

            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            feedback.textContent =
                "Please enter a valid email address.";

            feedback.style.color = "red";

            return;
        }

        // Validate phone number: digits only
        const phonePattern = /^\d+$/;

        if (!phonePattern.test(phone)) {

            feedback.textContent =
                "Phone number must contain digits only.";

            feedback.style.color = "red";

            return;
        }

        // Successful validation
        feedback.textContent =
            "Your information has passed validation successfully!";

        feedback.style.color = "green";

        contactForm.reset();

    });
}// ==================================
// ICON-ONLY DARK AND LIGHT MODE
// ==================================

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    // Load previously saved theme
    const savedTheme = localStorage.getItem("portfolioTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Display the correct icon
    function updateThemeIcon() {

        const isDarkMode = document.body.classList.contains("dark-mode");

        themeToggle.textContent = isDarkMode ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "title",
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    // Set the initial icon
    updateThemeIcon();

    // Switch between dark and light mode
    themeToggle.addEventListener("click", function () {

        const isDarkMode = document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "portfolioTheme",
            isDarkMode ? "dark" : "light"
        );

        updateThemeIcon();

    });
}
// ==========================================
// INTERACTIVE PROFILE PHOTO EDITOR
// ==========================================

(function () {
    const profileImage = document.querySelector(".hero-image");
    const editButton = document.getElementById("editPhotoBtn");
    const editor = document.getElementById("photoEditor");
    const uploadInput = document.getElementById("photoUpload");
    const canvas = document.getElementById("photoCanvas");

    if (!profileImage || !editButton || !editor || !canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    const zoomControl = document.getElementById("zoomControl");
    const horizontalControl = document.getElementById("horizontalControl");
    const verticalControl = document.getElementById("verticalControl");

    const rotateButton = document.getElementById("rotatePhotoBtn");
    const saveButton = document.getElementById("savePhotoBtn");
    const cancelButton = document.getElementById("cancelPhotoBtn");

    let currentImage = new Image();
    let rotation = 0;
    let originalSavedPhoto = profileImage.src;

    // Load previously saved profile picture
    const savedPhoto = localStorage.getItem("portfolioProfilePhoto");

    if (savedPhoto) {
        profileImage.src = savedPhoto;
        currentImage.src = savedPhoto;
    } else {
        currentImage.src = profileImage.src;
    }

    // Draw and crop the photograph
    function drawPhoto() {
        if (!currentImage.complete || !currentImage.naturalWidth) {
            return;
        }

        const width = canvas.width;
        const height = canvas.height;

        const zoom = Number(zoomControl.value);
        const horizontal = Number(horizontalControl.value);
        const vertical = Number(verticalControl.value);

        const scale = Math.max(
            width / currentImage.naturalWidth,
            height / currentImage.naturalHeight
        ) * zoom;

        ctx.clearRect(0, 0, width, height);

        ctx.save();

        ctx.translate(
            width / 2 + horizontal,
            height / 2 + vertical
        );

        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(scale, scale);

        ctx.drawImage(
            currentImage,
            -currentImage.naturalWidth / 2,
            -currentImage.naturalHeight / 2
        );

        ctx.restore();
    }

    currentImage.onload = drawPhoto;

    // Open editor
    editButton.addEventListener("click", function () {
        editor.hidden = false;

        zoomControl.value = 1;
        horizontalControl.value = 0;
        verticalControl.value = 0;
        rotation = 0;

        currentImage = new Image();
        currentImage.onload = drawPhoto;
        currentImage.src = profileImage.src;

        originalSavedPhoto = profileImage.src;
    });

    // Upload a new photograph
    uploadInput.addEventListener("change", function () {
        const file = uploadInput.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const uploadedImage = new Image();

            uploadedImage.onload = function () {
                currentImage = uploadedImage;

                zoomControl.value = 1;
                horizontalControl.value = 0;
                verticalControl.value = 0;
                rotation = 0;

                drawPhoto();
            };

            uploadedImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    // Adjust zoom and image position
    zoomControl.addEventListener("input", drawPhoto);
    horizontalControl.addEventListener("input", drawPhoto);
    verticalControl.addEventListener("input", drawPhoto);

    // Rotate photograph
    rotateButton.addEventListener("click", function () {
        rotation = (rotation + 90) % 360;
        drawPhoto();
    });

    // Save edited photograph
    saveButton.addEventListener("click", function () {
        try {
            const editedPhoto = canvas.toDataURL("image/jpeg", 0.9);

            localStorage.setItem(
                "portfolioProfilePhoto",
                editedPhoto
            );

            profileImage.src = editedPhoto;

            editor.hidden = true;
            uploadInput.value = "";

            alert("Your profile picture has been saved successfully!");
        } catch (error) {
            alert("Unable to save the picture. Try using a smaller image.");
        }
    });

    // Cancel editing
    cancelButton.addEventListener("click", function () {
        profileImage.src = originalSavedPhoto;
        editor.hidden = true;
        uploadInput.value = "";
    });

})();
