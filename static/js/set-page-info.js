function setInfoEid() {
  // Set username
  $("#userid").text(getLocalStorage("username"));

  // Update avatar
  getAvatarImg(getLocalStorage("email"))
  pathAvatarImg = getLocalStorage("avatar_img");
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
      list_issues(getLocalStorage("username"));
    } else if (page === "issues-1.html") {
      // Get task
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var uuid = urlParams.get("uuid");
      
      // Set Task
      setLocalStorage("target", uuid); 
      
      // TODO
      set_content();
    } else if (page == "issue-2.html") {
      // TODO
      set_content();

    } else if (page === "issues-3.html") {
      ticket_summary(getLocalStorage("target"));
    }
    
  } else if (page == "foot_print.html") {
    $("#nav-foot_print").addClass("active");
    
  } else if (page == "wallet.html") {
    $("#nav-wallet").addClass("active");
  }
  else if (page == "edit-info.html") {
    document.getElementById("email").innerHTML = getLocalStorage("email");
    document.getElementById("username").value = getLocalStorage("username");

    // Update avatar
    getAvatarImg(getLocalStorage("email"))
    pathAvatarImg = getLocalStorage("avatar_img");
    console.log(pathAvatarImg);
    var obj_img_avatar = document.getElementById("btn_avatar_img").firstChild;
    obj_img_avatar.style.backgroundImage = "url(" + HOST_URL_EID_DAEMON + pathAvatarImg  +  ")";
    console.log(obj_img_avatar.style.backgroundImage);
  } else if (page == "signup.html" || page == "signin.html") {
      console.log("in setpageinfo signup.html");
      var token = getLocalStorage("jwt");

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
      // Get task
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var uuid = urlParams.get("uuid");

      // Set Task
      setLocalStorage("target", uuid);

      // Get task info
      get_task_info(uuid, 0)
      var test = getLocalStorage(uuid);
      console.log(typeof(test));

      var obj_target = JSON.parse(getLocalStorage(uuid));
      var task_period = obj_target.period.split("~");

      // Set page data
      document.getElementById("task_name").value = obj_target.name;
      document.getElementById("task_start_time").value = task_period[0];
      document.getElementById("task_end_time").value = task_period[1];

      // Set task sdgs icon
      var obj_task_sdgs = document.getElementById("task_sdgs");

      for(let index = 1; index <= 17; index++) {
        // Check SDGs
	if (obj_target.content["sdgs-" + index.toString()] == "0") {
	  continue;
	}

        var a = document.createElement("a");
        a.className = "d-block";

        var img = document.createElement("img");
        img.className = "mr-2";

	let path = "";
	if (index < 10) {
	  path = "/static/imgs/SDGS/E_WEB_0";
	} else {
          path = "/static/imgs/SDGS/E_WEB_";
	}

        img.src = path + index.toString() + ".png";
        img.setAttribute("width", "30px");
        img.setAttribute("height", "30px");

        obj_task_sdgs.appendChild(a);
        a.appendChild(img);
      }
  }
}
