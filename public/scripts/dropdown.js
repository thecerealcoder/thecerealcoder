var login = document.getElementById("dropdownLogin");
var loginDrop = document.getElementById("loginDrop");
var searchBtn = document.getElementById("searchBtn");
var search = document.getElementById("dropdownSearch");
var searchDrop = document.getElementById("searchDrop");
var user = document.getElementById("dropdownUser");
var userDrop = document.getElementById("userDrop");

if(login !== null) {
    login.addEventListener("click", function(e) {
        login.classList.toggle("caret");
        loginDrop.classList.toggle("hide");
        loginDrop.classList.toggle("show");
    });
}

if(user !== null) {
    user.addEventListener("click", function(e) {
        user.classList.toggle("caret");
        userDrop.classList.toggle("hide");
        userDrop.classList.toggle("show");
    });
}

search.addEventListener("click", function(e) {
    search.classList.toggle("caret");
    searchDrop.classList.toggle("hide");
    searchDrop.classList.toggle("showSearch");
});

function searchBtn() {
    search.classList.toggle("caret");
    searchDrop.classList.toggle("hide");
    searchDrop.classList.toggle("showSearch");
}


document.body.addEventListener("click", function(e){
   if(e.target !== searchDrop && e.target !== search && e.target !== searchBtn && !searchDrop.contains(e.target)){
    search.classList.remove("caret");
    searchDrop.classList.add("hide");
    searchDrop.classList.remove("showSearch");
   } 

   if(login !== null){
    if (e.target !== loginDrop && e.target !== login && !loginDrop.contains(e.target)){
        login.classList.remove("caret");
        loginDrop.classList.add("hide");
        loginDrop.classList.remove("show");
    }
}

    if(user !== null){  
        if (e.target !== userDrop && e.target !== user && !userDrop.contains(e.target)){
            user.classList.remove("caret");
            userDrop.classList.add("hide");
            userDrop.classList.remove("show");
        }
    }
});



