function update_ticket(uuid_target, obj_target) {
  setLocalStorage(uuid_target, JSON.stringify(obj_target));
}

function set_task_in_page(obj) {
  var elem_issues_list = document.getElementById("issues-list");
  
  var col_md_4 = document.createElement("div");
  col_md_4.className = "col-md-4";

  var card_p_3_mb_2 = document.createElement("div");
  card_p_3_mb_2.className = "card p-3 mb-2";

  var img = document.createElement("img");
  img.id = "task_cover_" + obj.uuid;

  try {
    img.src = HOST_URL_TPLANET_DAEMON + obj.thumbnail;
    img.setAttribute("width", "160");
    img.setAttribute("height", "160");
  } catch (e) {
    console.log(e)
  }

  // Overlay
  var obj_parent = null;
  var resultTaskVerified = checkTaskVerified(obj.uuid);
  if (resultTaskVerified.status == true) {
    obj_parent = document.createElement("div");
    obj_parent.className = "watermark";
    obj_parent = overlay_on_task(img, obj_parent);
  }

  var a = document.createElement("a"); 
  a.src = obj.thumbnail;
  a.href = "/tasks/activity_convey_ideas.html?task=" + obj.uuid + "&gps=" + obj.gps;

  var card_p_4 = document.createElement("div");
  card_p_4.className = "card p-4";
  card_p_4.innerHTML = obj.name;

  // Append
  try {
    elem_issues_list.appendChild(col_md_4);
    col_md_4.appendChild(card_p_3_mb_2);
    card_p_3_mb_2.appendChild(a);

    // a.appendChild(img);
    if (resultTaskVerified.status == true) {
      a.prepend(obj_parent);
    } else {
      a.appendChild(img);
    }

    card_p_3_mb_2.appendChild(card_p_4);
  } catch (e) {
    console.log(e);
  }
}

function get_task_info(req_uuid_task, set_page = 1) {

  var resultJSON = {};
  resultJSON = get_task_description(req_uuid_task);

  try {
    setLocalStorage(resultJSON.uuid, JSON.stringify(resultJSON));
    // Set ticket
    var dataJSON = {"s1":"0", "s2":"0", "s3":"0", "s4":"0", "s5":"0", "s6":"0", "s7":"0", 
    "s8":"0", "s9":"0", "s10":"0", "s11":"0", "s12":"0", "s13":"0", "s14":"0", "s15":"0", "s16":"0", "s17":"0"};
  
    resultJSON.ticket =  dataJSON;
    update_ticket(req_uuid_task, resultJSON);

    // Set tasks in weg page
    if (set_page == 1) {
      set_task_in_page(JSON.parse(getLocalStorage(resultJSON.uuid)));
    }
  } catch (e) {console.log(e);}
}

function list_issues(email) {
  var resultJSON = {};
  resultJSON = get_user_uuid_tasks(email);

  try {
    // Set LocalStorage
    setLocalStorage("list_tasks", resultJSON.uuid);
    // Set task info
    for (var i = 0; i < resultJSON.uuid.length; i++)  {
      var target_ticket = "";
      if (getLocalStorage(resultJSON.uuid[i]) != "") {
        var obj_uuid = JSON.parse(getLocalStorage(resultJSON.uuid[i]));
        if (obj_uuid.ticket != null) {
          target_ticket = obj_uuid.ticket;
        }
      } 
      
      if( getLocalStorage(resultJSON.uuid[i]) == "" || obj_uuid.ticket == "") {
        get_task_info(resultJSON.uuid[i]);
      } else {
        var obj_task = getLocalStorage(resultJSON.uuid[i]);
        set_task_in_page(JSON.parse(obj_task));
      }
    }
  } catch (e) { console.log(e); }
}

function checkTaskVerified(uuid) {
  var resultJSON = {};
  resultJSON.status = false;

  // Get status
  var obj_task_status = get_task_status(uuid);

  // Check task task
  if (obj_task_status.content == 1) {
    resultJSON.status = true;
    return resultJSON
  }

  // If false, calculate progress and check in local again
  if (obj_task_status.content == 0) {
    var obj_task_progress = cal_progress(uuid);
    var obj_task_content = obj_task_progress.content;
    if ((obj_task_content.all.length !=0 ) && (obj_task_content.verified.length == obj_task_content.all.length)) {
      resultJSON.status = true;
      return resultJSON
    }
  }

  return resultJSON
}

function overlay_on_task(img, obj_parent) {
  obj_parent.append(img);
  return obj_parent;
}
