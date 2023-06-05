function edit_username() {
  var username = document.getElementById("username").value;
  var retultJSON = {};
  retultJSON = modify_username(username);

  // Reset LocalStorage
  try {
    setLocalStorage("username", retultJSON.username);
    window.location.replace("/eid.html");
  } catch (e) {console.log(e);}
}

function logout() {
  var resultBool = false;
  resultBool = verifyToken(getLocalStorage("jwt"));

  // Reset LocalStorage
  if (resultBool == true) {
    setLocalStorage("jwt", "");
    window.location.replace("/index.html");
  }
}

function getAvatarImg() {
  // Modify account
  var resultJSON = {};
  resultJSON = getAccountAvatarImg();

  // Reset LocalStorage
  try{
    setLocalStorage("avatar_img", resultJSON.url)
  } catch (e) {console.log(e);}
}