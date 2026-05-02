document.addEventListener("DOMContentLoaded", function() {

    // ── Navigation ──
    let homeLink  = document.querySelector("#home-link");
let boardLink = document.querySelector("#board-link");
let aboutLink = document.querySelector("#about-link");

let activePage = document.querySelectorAll(".nav");

// ── Save & restore active page on refresh ──
function navigateTo(page) {
    document.querySelector("#home").style.display  = page === "home"  ? "block" : "none";
    document.querySelector("#board").style.display = page === "board" ? "grid"  : "none";
    document.querySelector("#about").style.display = page === "about" ? "block" : "none";

    homeLink.classList.toggle("activeNav",  page === "home");
    boardLink.classList.toggle("activeNav", page === "board");
    aboutLink.classList.toggle("activeNav", page === "about");

    sessionStorage.setItem("activePage", page);
}

// ── Restore last page on load (defaults to home) ──
const savedPage = sessionStorage.getItem("activePage") || "home";
navigateTo(savedPage);

homeLink.addEventListener("click", function(e) {
    e.preventDefault();
    navigateTo("home");
});

boardLink.addEventListener("click", function(e) {
    e.preventDefault();
    navigateTo("board");
});

aboutLink.addEventListener("click", function(e) {
    e.preventDefault();
    navigateTo("about");
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