document.addEventListener("DOMContentLoaded", function() {

    // ── Navigation ──
    let homeLink = document.querySelector("#home-link");
    let boardLink = document.querySelector("#board-link");
    let aboutLink = document.querySelector("#about-link");

    function navigateTo(page) {
        document.querySelector("#home").style.display  = page === "home"  ? "block" : "none";
        document.querySelector("#board").style.display = page === "board" ? "grid"  : "none";
        document.querySelector("#about").style.display = page === "about" ? "block" : "none";

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
    let modalTitle = document.getElementById('modal-title');
    let modalDesc = document.getElementById('modal-desc');
    let btnConfirm = document.querySelector('.btn-confirm');
    let btnCancel = document.getElementById('btn-cancel');
    let btnClose = document.getElementById('modal-close');
    let currentColumn = '';

    function openModal(column) {
        currentColumn = column;
        modalTitle.value = '';
        modalDesc.value = '';
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
        addTask(currentColumn, title, modalDesc.value.trim());
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
            desc: desc || ''
        }
        board[column].push(task);
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
                    <button class="btn-delete" onclick="deleteTask(${task.id}, '${column}')">Delete</button>
                </div>
            `;
            columnEl.appendChild(card);
        });

        updateCounts();
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
});