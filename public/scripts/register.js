var username = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");
var confirm = document.getElementById("confirmPass");
var submit = document.getElementById("submit");
var validEmail;
var validUser;
var validPass;
var validConfirm;

email.addEventListener("keyup", (e) => {
    validEmail = email.checkValidity();

    if(validEmail && validUser && validPass && validConfirm) {
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

    if(validEmail && validUser && validPass && validConfirm) {
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

    if(validEmail && validUser && validPass && validConfirm) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

password.addEventListener("focusout", (e) => {
    password.reportValidity();
});

confirm.addEventListener("keyup", (e) => {
    validConfirm = confirm.checkValidity();

    if(validEmail && validUser && validPass && validConfirm) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

confirm.addEventListener("focusout", (e) => {
    confirm.reportValidity();
});