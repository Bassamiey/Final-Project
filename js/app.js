document.addEventListener("DOMContentLoaded", function() {

    // ── Navigation ──
    let homeLink  = document.querySelector("#home-link");
    let boardLink = document.querySelector("#board-link");
    let aboutLink = document.querySelector("#about-link");

    homeLink.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#home").style.display  = "block";
        document.querySelector("#board").style.display = "none";
        document.querySelector("#about").style.display = "none";
    });

    boardLink.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#home").style.display  = "none";
        document.querySelector("#board").style.display = "grid";
        document.querySelector("#about").style.display = "none";
    });

    aboutLink.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#home").style.display  = "none";
        document.querySelector("#board").style.display = "none";
        document.querySelector("#about").style.display = "block";
    });

    // ── Board Data ──
    let board = {
        todo: [],
        inprogress: [],
        done: []
    }

    // ── Add Buttons ──
    let addbtn = document.querySelectorAll(".btn-add");

    function addTask(column, title) {
        let task = {
            id: Date.now(),
            title: title,
            desc: ''
        }
        board[column].push(task);
    }

    addbtn.forEach((btn) => {
        btn.addEventListener("click", function() {
            let column = btn.closest('.column').id.replace('col-', '');
            let title = prompt("Enter task:");
            if (title == "") return;
            if (title == null) return;
            addTask(column, title);
        });
    });

});