document.addEventListener("DOMContentLoaded", function() {

    //active page
    let loginStat = sessionStorage.getItem("login status");

    if (loginStat === "true") {
    window.location.href = "index.html";
    }

    //login buttons
    let loginBtn = document.querySelector("#login-btn");

    //login inputs
    let loginUsername = document.querySelector("#login-username");
    let loginPassword = document.querySelector("#login-password");
    
    //user credentials
    const credential = {
        bassam: { password: "bassam123" },
        pauline: { password: "pauline106" },
        jaisel: { password: "jaisel20" },
        leslie: { password: "leslie48" }
    }

    //login function
    function login (username, password) {

        let user = credential[username];

        if (user && user.password === password ){
            sessionStorage.setItem("login status", "true");
            window.location.href = "index.html";
        }else {
            alert("Invalid Username or Password")
        }
    }

    loginBtn.addEventListener("click", () => {
        login(loginUsername.value, loginPassword.value);
    });

});