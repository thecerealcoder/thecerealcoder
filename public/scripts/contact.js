var fname = document.getElementById("name");
var email = document.getElementById("email");
var message = document.getElementById("message");
var submit = document.getElementById("submit");
var validEmail;
var validName;
var validMessage;

fname.addEventListener("keyup", function(e) {
    validName = fname.checkValidity();
    console.log(validName);
    if(validEmail && validName && validMessage) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

fname.addEventListener("focusout", function(e) {
    fname.reportValidity();
});

email.addEventListener("keyup", function(e) {
    validEmail = email.checkValidity();
    console.log(validEmail);
    if(validEmail && validName && validMessage) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

email.addEventListener("focusout", function(e) {
    email.reportValidity();
});

message.addEventListener("keyup", function(e) {
    validMessage = message.checkValidity();
    console.log(validMessage);
    if(validEmail && validName && validMessage) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
});

message.addEventListener("focusout", function(e) {
    message.reportValidity();
});