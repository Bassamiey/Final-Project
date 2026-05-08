document.addEventListener("DOMContentLoaded", function() {

    //active page
    let loginStat = sessionStorage.getItem("login status");

    if (loginStat !== "true") {
        window.location.href = "loginpage.html";
    }


    // ── Navigation ──
    let homeLink = document.querySelector("#home-link");
    let boardLink = document.querySelector("#board-link");
    let aboutLink = document.querySelector("#about-link");

    function navigateTo(page) {
        let homeEl  = document.querySelector("#home");
        let boardEl = document.querySelector("#board");
        let aboutEl = document.querySelector("#about");

        homeEl.style.display  = "none";
        boardEl.style.display = "none";
        aboutEl.style.display = "none";

        let target = page === "home" ? homeEl : page === "board" ? boardEl : aboutEl;
        let displayVal = page === "board" ? "grid" : "block";

        target.style.display = displayVal;
        target.classList.remove("section-animate");
        target.classList.add("section-animate");

        homeLink.classList.toggle("activeNav",  page === "home");
        boardLink.classList.toggle("activeNav", page === "board");
        aboutLink.classList.toggle("activeNav", page === "about");

        sessionStorage.setItem("activePage", page);
    }

    const savedPage = sessionStorage.getItem("activePage") || "home";
    navigateTo(savedPage);

    homeLink.addEventListener("click", function(e) { e.preventDefault(); navigateTo("home"); });
    boardLink.addEventListener("click", function(e) { e.preventDefault(); navigateTo("board"); });
    aboutLink.addEventListener("click", function(e) { e.preventDefault(); navigateTo("about"); });

    // ── Board Data ──
    let board = { todo: [], inprogress: [], done: [] }

    // ── Modal ──
    let modalOverlay = document.getElementById('modal-overlay');
    let modalHeadline = document.getElementById('modal-headline');
    let modalTitle = document.getElementById('modal-title');
    let modalDesc = document.getElementById('modal-desc');
    let btnConfirm = document.getElementById('btn-confirm');
    let btnCancel = document.getElementById('btn-cancel');
    let btnClose = document.getElementById('modal-close');
    let currentColumn = '';
    let editingTaskId = null;

    function openModal(column, task = null) {
        currentColumn = column;
        if (task) {
            editingTaskId = task.id;
            modalHeadline.textContent = 'Edit Task';
            modalTitle.value = task.title;
            modalDesc.value = task.desc;
            btnConfirm.textContent = 'Save Changes';
        } else {
            editingTaskId = null;
            modalHeadline.textContent = 'Add Task';
            modalTitle.value = '';
            modalDesc.value = '';
            btnConfirm.textContent = 'Add Task';
        }
        modalOverlay.classList.add('open');
        modalTitle.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
    }

    btnConfirm.addEventListener('click', function() {
        let title = modalTitle.value.trim();
        if (title === '') {
            modalTitle.style.borderColor = '#ff4d4d';
            setTimeout(() => modalTitle.style.borderColor = '', 800);
            return;
        }

        if (editingTaskId) {
            updateTask(currentColumn, editingTaskId, title, modalDesc.value.trim());
        } else {
            addTask(currentColumn, title, modalDesc.value.trim());
        }
        closeModal();
    });

    btnCancel.addEventListener('click', closeModal);
    btnClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // ── Add Buttons ──
    let addbtn = document.querySelectorAll(".btn-add");

    addbtn.forEach((btn) => {
        btn.addEventListener("click", function() {
            let column = btn.closest('.column').id.replace('col-', '');
            openModal(column);
        });
    });

    // ── Add Task ──
    function addTask(column, title, desc) {
        let task = {
            id: Date.now(),
            title: title,
            desc: desc
        }
        board[column].push(task);
        renderColumn(column);
        saveBoard();
    }

    // ── Update Task ──
    function updateTask(column, id, title, desc) {
        let task = board[column].find(t => t.id == id);
        task.title = title;
        task.desc = desc;
        renderColumn(column);
        saveBoard();
    }

    // ── Render Column ──
    function renderColumn(column) {
        let columnEl = document.getElementById('col-' + column);
        let oldCards = columnEl.querySelectorAll('.task-card');
        oldCards.forEach(card => card.remove());

        board[column].forEach(function(task) {
            let card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <h3 class="task-title">${task.title}</h3>
                <p class="task-desc">${task.desc}</p>
                <div class="task-actions">
                    ${column !== 'todo' ? `<button class="btn-move" onclick="moveTask(${task.id}, '${column}', 'prev')">← Back</button>` : ''}
                    ${column !== 'done' ? `<button class="btn-move" onclick="moveTask(${task.id}, '${column}', 'next')">Next →</button>` : ''}
                    <button class="btn-edit" onclick="editTask(${task.id}, '${column}')">Edit</button>
                    <button class="btn-delete" onclick="deleteTask(${task.id}, '${column}')">Delete</button>
                </div>
            `;
            columnEl.appendChild(card);
        });

        updateCounts();
    }

    // ── Edit Task ──
    window.editTask = function(id, column) {
        let task = board[column].find(t => t.id == id);
        openModal(column, task);
    }

    // ── Move Task ──
    window.moveTask = function(id, fromColumn, direction) {
        let cols = ['todo', 'inprogress', 'done'];
        let toColumn = direction === 'next' ? cols[cols.indexOf(fromColumn) + 1] : cols[cols.indexOf(fromColumn) - 1];
        let task = board[fromColumn].splice(board[fromColumn].findIndex(t => t.id == id), 1)[0];
        board[toColumn].push(task);
        renderColumn(fromColumn);
        renderColumn(toColumn);
        saveBoard();
    }

    // ── Delete Task ──
    window.deleteTask = function(id, column) {
        board[column] = board[column].filter(t => String(t.id) !== String(id));
        renderColumn(column);
        saveBoard();
    }

    // ── Update Counts ──
    function updateCounts() {
        let total = 0;
        ['todo', 'inprogress', 'done'].forEach(col => {
            let count = board[col].length;
            total += count;
            let countEl = document.getElementById('count-' + col);
            if (countEl) countEl.textContent = count;
        });
        let totalEl = document.getElementById('total-counter');
        if (totalEl) totalEl.textContent = total + (total === 1 ? ' task' : ' tasks');
    }

    // ── Save & Load ──
    function saveBoard() {
        localStorage.setItem('taskflow-board', JSON.stringify(board));
    }

    function loadBoard() {
        let saved = localStorage.getItem('taskflow-board');
        if (saved) {
            board = JSON.parse(saved);
            renderColumn('todo');
            renderColumn('inprogress');
            renderColumn('done');
        }
    }

    loadBoard();

    let logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("login status");
        sessionStorage.removeItem("activePage");
        window.location.href = "loginpage.html";
    }); 
});