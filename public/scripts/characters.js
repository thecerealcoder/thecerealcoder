var comBox = document.getElementsByClassName("comBox");
var charSpan = document.getElementsByClassName("charSpan");

//Selecting text area and span element from comment box divs to update char count

    comBox[0].addEventListener("keyup", (e) => {
        var remaining = 1000 - comBox[0].value.length;
        charSpan[0].innerText = remaining + " characters remaining";
    });

    
    comBox[1].addEventListener("keyup", (e) => {
        var remaining = 1000 - comBox[1].value.length;
        charSpan[1].innerText = remaining + " characters remaining";
    });