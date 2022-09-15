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
  console.log( page );

  if (page == "eid.html") {
    setInfoEid();
  } else if (page.includes("issues")) {
    $("#nav-issues").addClass("active");
    
    // List issues
    if (page === "issues.html") {
      list_issues(getLocalStorage("username"));
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
    var obj_img_avatar = document.getElementById("btn_avatar_img").firstChild;
    obj_img_avatar.style.backgroundImage = "url(" + HOST_URL_EID_DAEMON + pathAvatarImg  +  ")";
  } else if (page == "signup.html" || page == "signin.html") {
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
    } else if (page == "activity_convey_ideas.html") {
      // Params
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var task = urlParams.get("task")

      // Set parent overview
      var obj_parent_task = get_task_description(task);
      document.getElementById("period").innerHTML = obj_parent_task.period;
      document.getElementById("overview").innerHTML = obj_parent_task.overview;

      var obj_task_container = document.getElementById("task_container");
      var list_child_tasks = get_child_tasks(task);
      for(var index=0; index<list_child_tasks.length; index++) {
        var obj_task = get_task_description(list_child_tasks[index]);

        // Create DOM
        /*
        * <tr>
              <td class="align-middle" style="font-size: 12px">元泰竹藝社</td>
              <td scope="row" class="align-middle">
                <img style="height: 30px;" src="/static/imgs/SDGS/E_WEB_04.png">
                <img style="height: 30px;" src="/static/imgs/SDGS/E_WEB_07.png">
              </td>
              <td class="text-center align-middle" style="font-size: 12px">11:30-12:00</td>
              <td class="text-center align-middle">
                <div class="btn btn-primary btn-sm" onclick="location.href='/tasks/activity_participation.html?uuid=00000014'">參與任務</div>
              </td>
            </tr>
        */

          var obj_tr = document.createElement("tr");
          var obj_td_name = document.createElement("td");
          obj_td_name.className = "align-middle";
          obj_td_name.style="font-size: 12px"
          
          if (parseInt(obj_task.type_task) == 0) {
            obj_td_name.innerHTML = obj_parent_task.name;
          } else {
            obj_td_name.innerHTML = obj_task.name;
          }

          var obj_td_sdg = document.createElement("td");
          obj_td_sdg.scope = "row";
          obj_td_sdg.className = "align-middle";

          // TODO: SDGs
          
          var content = JSON.parse(obj_task.content);

          var index_sdg = 0
          for (var key in content) {
            // index_sdg = ("0" + index).slice(-2);

            index_sdg ++;
            
            if ( parseInt(content[key]) != 0){
              var index_img = 0;
              if (index_sdg < 10){
                index_img = ("0" + index_sdg).slice(-2);
              } else {
                index_img = index_sdg;
              }
              var obj_img_04 = document.createElement("img");
              obj_img_04.className = "mr-2";
              obj_img_04.style = "height: 30px; padding-left: 2;";
              obj_img_04.src = "/static/imgs/SDGS/E_WEB_" + index_img + ".png";

              obj_td_sdg.append(obj_img_04);
            } 
          }

          /* var obj_img_04 = document.createElement("img");
          obj_img_04.className = "mr-2";
          obj_img_04.style = "height: 30px; padding-left: 2;";
          obj_img_04.src = "/static/imgs/SDGS/E_WEB_04.png";

          var obj_img_08 = document.createElement("img");
          obj_img_08.className = "mr-2";
          obj_img_08.style = "height: 30px; padding-left: 2;";
          obj_img_08.src = "/static/imgs/SDGS/E_WEB_08.png"; */

          var obj_td_period = document.createElement("td");
          obj_td_period.className = "text-center align-middle";
          obj_td_period.style = "font-size: 12px";

          if (parseInt(obj_task.type_task) == 0) {
            obj_td_period.innerHTML = obj_parent_task.period;
          } else {
            obj_td_period.innerHTML = obj_task.period;
          }

          var obj_td_submit = document.createElement("td");
          obj_td_submit.className = "text-center align-middle";

          var obj_div_submit = document.createElement("div");
          obj_div_submit.className = "btn btn-primary btn-sm";

          obj_div_submit.setAttribute("onclick", "location.href='/tasks/activity_participation.html?uuid=" + obj_task.uuid + "'");
          
          obj_div_submit.innerHTML = "參與任務";

          // Append
          //obj_td_sdg.append(obj_img_04);
          //obj_td_sdg.append(obj_img_08);
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
      
      //var obj_target = JSON.parse(getLocalStorage(uuid));
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

      for(let index = 1; index <= 17; index++) {
        // Check SDGs
        if (obj_target_content["sdgs-" + index.toString()] == "0") {
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

        // form task display
        if(obj_target.type_task == 0) {
          document.getElementById("img_block").style.display = "none";
          document.getElementById("btn_foot_print_img").style.display = "none";
          document.getElementById("comment_block").style.display = "none";
        }

      }
  }
}
