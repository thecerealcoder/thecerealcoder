var fname = document.getElementById("name");
var email = document.getElementById("email");
var message = document.getElementById("message");
var submit = document.getElementById("submit");
var validEmail;
var validName;
var validMessage;

fname.addEventListener("keyup", (e) => {
    validName = fname.checkValidity();
    console.log(validName);
    if(validEmail && validName && validMessage) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

fname.addEventListener("focusout", (e) => {
    fname.reportValidity();
});

email.addEventListener("keyup", (e) => {
    validEmail = email.checkValidity();
    console.log(validEmail);
    if(validEmail && validName && validMessage) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

email.addEventListener("focusout", (e) => {
    email.reportValidity();
});

message.addEventListener("keyup", (e) => {
    validMessage = message.checkValidity();
    console.log(validMessage);
    if(validEmail && validName && validMessage) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

message.addEventListener("focusout", (e) => {
    message.reportValidity();
});