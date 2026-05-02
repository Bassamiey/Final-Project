document.addEventListener("DOMContentLoaded", function() {

    let loginBtn = document.querySelector("#login-btn");
    let loginUsername = document.querySelector("#login-username");
    let loginPassword = document.querySelector("#login-password");
    

    const credential = {
        member1 : {username : "bassam", password : "bassam123"},
        member2 : {username : "pau", password: "pau123"}
    }

    function login (username, password) {

        let user = credential[username];

        if (user && user.password === password ){
            window.location.href = "index.html"
        }else {
            alert("Invalid Username or Password")
        }
    }

    loginBtn.addEventListener("click", () => {
        login(loginUsername.value, loginPassword.value);
    });

});