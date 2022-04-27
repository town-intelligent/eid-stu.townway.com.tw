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
  } else if (page == "signup.html" || page == "signin.html") {
      console.log("in setpageinfo signup.html");
      var token = getCookie("jwt");

      if (token == "") {
        return;
      }

      var dataJSON = {};
      dataJSON.token =  token;

      $.ajax({
        url: HOST_URL_EID_DAEMON + "/accounts/verify_jwt",
        type: "POST",
        async: false,
        crossDomain: true,
        data:  dataJSON,
        success: function(returnData) {
          const obj = JSON.parse(returnData);
          if (obj.result) {
            console.log("JWT still avliable");
            // Redirect to eID page
            window.location.replace("/eid.html");
          } else {
            // OK for signup, just return
            console.log("JWT still NOT avliable");
            return;
          }
        },
        error: function(xhr, ajaxOptions, thrownError){
          console.log(thrownError);
        }
      });
  } else if (page == "activity_participation.html") {
      console.log("hello success in set page info");

      // Get task
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var uuid = urlParams.get("uuid");

      // Set Task
      setCookie("target", uuid, 1);

      // Get task info
      get_task_info(uuid, 0)
      var test = getCookie(uuid);
      console.log(typeof(test));

      var obj_target = JSON.parse(getCookie(uuid));
      var task_period = obj_target.period.split("~");

      // Set page data
      document.getElementById("task_name").value = obj_target.name;
      document.getElementById("task_start_time").value = task_period[0];
      document.getElementById("task_end_time").value = task_period[1];
  }
}
