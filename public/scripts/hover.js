var cereal = document.getElementsByClassName("cerealBox");

Array.from(cereal).forEach( function(box) {
    box.addEventListener("touchstart", function(e) {
        cereal.classList.toggle("hoverEffect");
    });
});

