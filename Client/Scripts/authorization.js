// "use strict";
// ((function () {
//   // check if user is logged in
//   if (!sessionStorage.getItem("front_desk_agent")) {
//     // if not...redirect them back to the login page
//     let logoutText = document.getElementsByClassName("nav-item")[5];
//     location.href = "login.html";
//     logoutText.innerHTML = `<a id="login" class="nav-link" href="/login.html">Login</a>`;
//     sessionStorage.removeItem(type_of_user);
//   }
// }))();