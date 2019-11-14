var cereal = document.getElementsByClassName("cerealBox");
var sign = document.getElementById("sign");
var signFront = document.getElementById("signFront");

Array.from(cereal).forEach( function(box) {
    box.addEventListener("touchstart", function(e) {
        cereal.classList.toggle("hoverEffect");
    });
});

sign.addEventListener("touchstart", function(e) {
    sign.classList.toggle("signHover");
});
