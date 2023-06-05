function task_save_to_eID(obj_task) {
  // Save
  var resultJSON = {};
  try {
    resultJSON = task_save(obj_task);
  } catch (e) { 
    console.log(e); 
    alert("您掃描的 QR Code 可能有問題！請洽系統管理員！ (003)");
  }
}

function setInfoEid() {
  // Set username
  $("#userid").text(getLocalStorage("username"));

  // Update avatar
  getAvatarImg(getLocalStorage("email"))
  pathAvatarImg = getLocalStorage("avatar_img");

  // Clear cache
  var obj_img_avatar = document.getElementById("img_avatar");
  obj_img_avatar.style.backgroundImage = "url(" + HOST_URL_EID_DAEMON + pathAvatarImg  +  ")";
}

function setPageInfo() {
  var path = window.location.pathname;
  var page = path.split("/").pop();

  if (page == "eid.html") {
    var uuid_save_task = getLocalStorage("save_task");
    if (uuid_save_task != "") {
      var obj_task = save_task_by_uuid(uuid_save_task);
      task_save_to_eID(obj_task);
      setLocalStorage("save_task", null);
    }

    // eID page
    setInfoEid();
  } else if (page.includes("issues")) {
    $("#nav-issues").addClass("active");
    
    // List issues
    if (page === "issues.html") {
      list_issues(getLocalStorage("email"));
    }
    
  } else if (page == "foot_print.html") {
    $("#nav-foot_print").addClass("active");

    // Get user tasks
    var str_list_task_UUIDs = getLocalStorage("list_tasks");
    var list_task_UUIDs  = [];

    if (str_list_task_UUIDs === "") {
      // Get user task UUIDs
      var resultJSON = {};
      resultJSON = get_user_uuid_tasks(getLocalStorage("email"));

      try {
        list_task_UUIDs = resultJSON.uuid;
        setLocalStorage("list_tasks", resultJSON.uuid);
      } catch (e) {console.log(e); return;};
    } else {
      try {
        list_task_UUIDs = str_list_task_UUIDs.split(",");
      } catch (e) {console.log(e); return;};
    }

    // Submit all tasks
    try {
      for (var index = 0; index < list_task_UUIDs.length; index ++) {
        submitTaskTickets(list_task_UUIDs[index]);
      }
    } catch (e) {console.log(e);};

    // Update Table data
    try {
      if (list_task_UUIDs.length != 0) {
        updateTalbeData();
      }
    } catch (e) {console.log(e);};

  } else if (page == "wallet.html") {
    $("#nav-wallet").addClass("active");
  }
  else if (page == "edit-info.html") {
    document.getElementById("email").innerHTML = getLocalStorage("email");
    document.getElementById("username").value = getLocalStorage("username");

    // Update avatar
    getAvatarImg(getLocalStorage("email"))
    pathAvatarImg = getLocalStorage("avatar_img");
    var obj_img_avatar = document.getElementById("btn_avatar_img").firstChild;
    obj_img_avatar.style.backgroundImage = "url(" + HOST_URL_EID_DAEMON + pathAvatarImg  +  ")";
  } else if (page == "signup.html" || page == "signin.html") {

      // Check if pass any task UUID and save to localStorage
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var task = urlParams.get("task");
      if (task != null) {
        setLocalStorage("save_task", task);
      } else { console.log("no any task should be save to local storage."); }

      // Detect account login status
      var resultBool = false;
      resultBool = verifyToken(getLocalStorage("jwt"));
      if (resultBool == true) {
        window.location.replace("/eid.html");
      }
    } else if (page == "activity_convey_ideas.html") {
      // Params
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var task = urlParams.get("task");
      var gps = urlParams.get("gps");

      // Set parent overview
      var obj_parent_task = get_task_description(task);
      document.getElementById("period").innerHTML = obj_parent_task.period;
      document.getElementById("overview").innerHTML = obj_parent_task.overview;

      var obj_task_container = document.getElementById("task_container");
      var list_child_tasks = get_child_tasks(task);
      for(var index=0; index<list_child_tasks.length; index++) {
        var obj_task = get_task_description(list_child_tasks[index]);

        var obj_tr = document.createElement("tr");
        var obj_td_name = document.createElement("td");
        obj_td_name.className = "align-middle";
        obj_td_name.style="font-size: 12px; min-width:200px"
        
        if (parseInt(obj_task.type_task) == 0) {
          obj_td_name.innerHTML = obj_parent_task.name;
        } else {
          obj_td_name.innerHTML = obj_task.name;
        }

        var obj_td_sdg = document.createElement("td");
        obj_td_sdg.scope = "row";
        obj_td_sdg.className = "align-middle";
        obj_td_sdg.style = "min-width: 200px"

        // SDGs
        var content = JSON.parse(obj_task.content);
        for(let index = 1; index <= 27; index++) {
          // Check SDGs
          if (content["sdgs-" + index.toString()] != "1") {
            continue;
          }
  
          var a = document.createElement("a");
          a.className = "d-block";
  
          var img = document.createElement("img");
          img.className = "mr-2 mb-2";
  
          let path = "";
          if (index < 10) {
            path = "/static/imgs/SDGS/E_WEB_0";
          } else {
            path = "/static/imgs/SDGS/E_WEB_";
          }
  
          img.src = path + index.toString() + ".png";
          img.setAttribute("width", "30px");
          img.setAttribute("height", "30px");

          obj_td_sdg.append(img);
        }

        var obj_td_period = document.createElement("td");
        obj_td_period.className = "text-center align-middle";
        obj_td_period.style = "font-size: 12px; min-width:150px";

        if (parseInt(obj_task.type_task) == 0) {
          obj_td_period.innerHTML = obj_parent_task.period;
        } else {
          obj_td_period.innerHTML = obj_task.period;
        }

        var obj_td_submit = document.createElement("td");
        obj_td_submit.className = "text-center align-middle";

        var obj_div_submit = document.createElement("div");
        obj_div_submit.className = "btn btn-primary btn-sm";
        obj_div_submit.style="min-width:150px";

        obj_div_submit.setAttribute("onclick", "location.href='/tasks/activity_participation.html?uuid=" + obj_task.uuid + "&gps=" + gps + "'");
        
        obj_div_submit.innerHTML = "參與任務";

        // Append
        obj_td_submit.append(obj_div_submit);
        
        obj_tr.append(obj_td_name);
        obj_tr.append(obj_td_sdg);
        obj_tr.append(obj_td_period);
        obj_tr.append(obj_td_submit);

        obj_task_container.append(obj_tr);
      }
    } else if (page == "activity_participation.html") {
      // Get task
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var uuid = urlParams.get("uuid");
      var gps = urlParams.get("gps");
      
      // Set Task
      setLocalStorage("target", uuid);

      // Get task info
      var uuid_target_parent = null;
      var obj_target_parent = null;
      var obj_target = get_task_description(uuid);
      if (parseInt(obj_target.type_task) == 0) {
        uuid_target_parent = get_parent_task(obj_target.uuid);
        obj_target_parent = get_task_description(uuid_target_parent);
      }
      
      var task_period = [];
      try {
        if (parseInt(obj_target.type_task) == 0) {
          task_period = obj_target_parent.period.split("-");
        } else {
          task_period = obj_target.period.split("-");
        }
      } catch (e) {}

      // Set page data
      if (task_period.length == 2) {
        document.getElementById("task_start_time").value = task_period[0];
        document.getElementById("task_end_time").value = task_period[1];
      }

      if (parseInt(obj_target.type_task) == 0) {
        document.getElementById("task_name").value = obj_target_parent.name;
      } else {  
        document.getElementById("task_name").value = obj_target.name;
      }

      // Set task sdgs icon
      var obj_task_sdgs = document.getElementById("task_sdgs");
      var content = obj_target.content.replace(/'/g, '"')
      var obj_target_content = JSON.parse(content);

      for(let index = 1; index <= 27; index++) {
        // Check SDGs
        if (obj_target_content["sdgs-" + index.toString()] != "1") {
	        continue;
	      }

        var a = document.createElement("a");
        a.className = "d-block";

        var img = document.createElement("img");
        img.className = "mr-2 mb-2";

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

        // form task display
        if(obj_target.type_task == 0) {
          document.getElementById("img_block").style.display = "none";
          document.getElementById("btn_foot_print_img").style.display = "none";
          document.getElementById("comment_block").style.display = "none";
        }
      }

      // Push GPS to T-planet
      if (gps === "true") {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pushPosition);
        } else {
          return {"result" :false, "content": "Geolocation is not supported by this browser."};
        }
      }
    } 
}

function pushPosition(position) {
  // Get task
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");
  
  gps_set(position.coords.latitude, position.coords.longitude,  uuid);
}