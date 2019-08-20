var shelves = document.getElementsByClassName("shelf");

var mq = window.matchMedia( "(max-width: 992px)");

mq.addListener(WidthChange);
WidthChange(mq);




function WidthChange(mq) {
    if(mq.matches) {
        var count;
        if(shelves.length % 2 === 0) {
            count = 1;
            Array.from(shelves).forEach((shelf) => {
                shelf.classList.remove("show");
                shelf.classList.add("hide");
                if(count % 2 === 0) {
                    shelf.classList.remove("hide");
                    shelf.classList.add("show");
                }
                count++;
            });
        } else if(shelves.length % 2 === 1) {
            count = 1;
            Array.from(shelves).forEach((shelf) => {
                shelf.classList.remove("show");
                shelf.classList.add("hide");
                if(count % 2 === 0 || count === shelves.length) {
                    shelf.classList.remove("hide");
                    shelf.classList.add("show");
                }
                count++;
            });
        }

    } else {
        Array.from(shelves).forEach((shelf) => {
            shelf.classList.remove("hide");
            shelf.classList.remove("show");
            
        });
    }
}