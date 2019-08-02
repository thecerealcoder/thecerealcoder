var searchBtn = document.getElementById("searchBtn");
var searchIpt = document.getElementById("searchIpt");

searchBtn.addEventListener("click", (e) => {
    searchIpt.classList.toggle("searchIptShow");
});