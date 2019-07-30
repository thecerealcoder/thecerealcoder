var username = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");
var submit = document.getElementById("submit");
var validEmail;
var validUser;
var validPass;

email.addEventListener("keyup", (e) => {
    validEmail = email.checkValidity();

    if(validEmail && validUser && validPass) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

email.addEventListener("focusout", (e) => {
    email.reportValidity();
});


username.addEventListener("keyup", (e) => {
    validUser = username.checkValidity();

    if(validEmail && validUser && validPass) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

username.addEventListener("focusout", (e) => {
    username.reportValidity();
});


password.addEventListener("keyup", (e) => {
    validPass = password.checkValidity();

    if(validEmail && validUser && validPass) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

password.addEventListener("focusout", (e) => {
    password.reportValidity();
});