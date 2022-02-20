function setInfoEid() {
  // Set username
  $("#userid").text(getCookie("username"));

  // Update avatar
  getAvatarImg(getCookie("email"))
  pathAvatarImg = getCookie("avatar_img");
  console.log(pathAvatarImg);
  var obj_img_avatar = document.getElementById("img_avatar");
  obj_img_avatar.style.backgroundImage = "url(" + HOST_URL_EID_DAEMON + pathAvatarImg  +  ")";
  console.log(obj_img_avatar.style.backgroundImage);
}

function setPageInfo() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  console.log( page );

  if (page == "eid.html") {
    setInfoEid();
  } else if (page.includes("issues")) {
    $("#nav-issues").addClass("active");
    
    // List issues
    if (page === "issues.html") {
      list_issues(getCookie("username"));
    } else if (page === "issues-1.html") {
      // Get task
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var uuid = urlParams.get("uuid");
      
      // Set Task
      setCookie("target", uuid, 1); 
      
      // TODO
      set_content();
    } else if (page == "issue-2.html") {
      // TODO
      set_content();

    } else if (page === "issues-3.html") {
      ticket_summary(getCookie("target"));
    }
    
  } else if (page == "foot_print.html") {
    $("#nav-foot_print").addClass("active");
    
  } else if (page == "wallet.html") {
    $("#nav-wallet").addClass("active");
  }
  else if (page == "edit-info.html") {
    document.getElementById("email").innerHTML = getCookie("email");
    document.getElementById("username").value = getCookie("username");

    // Update avatar
    getAvatarImg(getCookie("email"))
    pathAvatarImg = getCookie("avatar_img");
    console.log(pathAvatarImg);
    var obj_img_avatar = document.getElementById("btn_avatar_img").firstChild;
    obj_img_avatar.style.backgroundImage = "url(" + HOST_URL_EID_DAEMON + pathAvatarImg  +  ")";
    console.log(obj_img_avatar.style.backgroundImage);
  }
}
