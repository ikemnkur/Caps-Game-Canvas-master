var loginBtn = document.getElementById('btnLogin');
var registerBtn = document.getElementById('btnRegister');
var submitButton = document.getElementById('submit-button');
var emailInput = document.getElementById('emailInput');
var email = document.getElementById('email');
var confirmPassword = document.getElementById('confirmPassword'); 
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;

const portnum = 3000;

loginBtn.addEventListener('click', function () {
    submitButton.innerText = 'Login';
    email.hidden = true;
    confirmPassword.hidden = true;
    mode = "login";
});

registerBtn.addEventListener('click', function () {
    submitButton.innerText = 'Register';
    email.hidden = false;
    confirmPassword.hidden = false;
    mode = "register";
});

let mode = "login";

submitButton.addEventListener('click', function () {
    if (mode == "login") {
        login(username.value, password.value)
    } else if (mode == "register") {
        register(username.value, email.value, password.value)
    }
});

async function login(username, password) {
    // remove friend from follow list and hide thier messages from the chat
    var payload = {
        "username": username,
        "password": password
    };
    postData("http://localhost:" + portnum + "/login", payload).then((data) => {
        //console.log(data);
    });
}

async function register(username, email, password) {
    // remove friend from follow list and hide thier messages from the chat
    var payload = {
        "username": username,
        "email": email,
        "password": password
    };
    postData("http://localhost:" + portnum + "/register", payload).then((data) => {
        //console.log(data);
    });
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    console.log("Posted data: ", data);
    return response.json(); // parses JSON response into native JavaScript objects
}