var deleteuser = document.getElementById("deleteUser");
var confirmDelete = document.getElementById("confirmDelete");

if(deleteuser !== null){
    deleteuser.addEventListener("click", function(e) {
        confirmDelete.classList.remove("hide");
        confirmDelete.classList.add("show");
    });
}