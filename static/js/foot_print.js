function addWeight(w1, w2) {

  const combined = [w1, w2].reduce((a, obj) => {
    Object.entries(obj).forEach(([key, val]) => {
      a[key] = (parseInt(a[key]) || 0) + parseInt(val);
    });
    return a;
  });

  return combined;
}

function submitTaskComment(task_UUID) {
  // Get task UUID
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");

  var dataJSON = {};
  dataJSON.uuid = uuid;
  dataJSON.email = getLocalStorage("email");
  dataJSON.comment = document.getElementById("Idcomment").value;
  
  var img = document.getElementById("id_upload_foot_print_img").style.backgroundImage;
  img = img.replace('url("', '');
  img = img.replace('")', '');

  dataJSON.img = getLocalStorage("commentImg"); // img; // getLocalStorage("commentImg");

  var resultBool = false;
  resultBool = comment_project(dataJSON);

  if (resultBool == true) {
    alert("上傳成功!");
  } else {
    alert("上傳失敗，請檢查您的圖檔是否正確！")
  }

  return;
}

function submitTaskTickets(task_UUID) {
  if (getLocalStorage(task_UUID)=== "") {
    return;
  }

  obj = JSON.parse(getLocalStorage(task_UUID));
  var dataJSON = {"uuid": task_UUID,"sdgs-1":obj.ticket.s1,"sdgs-2":obj.ticket.s2,
          "sdgs-3":obj.ticket.s3,"sdgs-4":obj.ticket.s4,"sdgs-5":obj.ticket.s5,
          "sdgs-6":obj.ticket.s6,"sdgs-7":obj.ticket.s7,"sdgs-8":obj.ticket.s8,
          "sdgs-9":obj.ticket.s9,"sdgs-10":obj.ticket.s10,"sdgs-11":obj.ticket.s11,
          "sdgs-12":obj.ticket.s12,"sdgs-13":obj.ticket.s13,"sdgs-14":obj.ticket.s14,
          "sdgs-15":obj.ticket.s15,"sdgs-16":obj.ticket.s16,"sdgs-17":obj.ticket.s17,
          "sdgs-18":obj.ticket.s18,"sdgs-19":obj.ticket.s19,"sdgs-20":obj.ticket.s20,
          "sdgs-21":obj.ticket.s21,"sdgs-22":obj.ticket.s22,"sdgs-23":obj.ticket.s23,
          "sdgs-24":obj.ticket.s24,"sdgs-25":obj.ticket.s25,"sdgs-26":obj.ticket.s26,
          "sdgs-27":obj.ticket.s27};

  var taskWeight = {};
  try {
    taskWeight = tasks_submit(dataJSON);
    // Set project weight to LocalStorage
    setLocalStorage("project_weight", taskWeight);
  } catch(e) {console.log(e);}

  return taskWeight;
}

function updateNodeData(baseNodes, baseLinks) {
  // Get user tasks
  var str_list_task_UUIDs = getLocalStorage("list_tasks");
  var list_task_UUIDs  = [];
  if (str_list_task_UUIDs === "") {
    var resultJSON = {};
    resultJSON = get_user_uuid_tasks(getLocalStorage("email"));

    try {
      list_task_UUIDs = resultJSON.uuid;
    } catch(e) { console.log(e); }
  } else {
    try {
      list_task_UUIDs = str_list_task_UUIDs.split(",");
    } catch(e) { console.log(e); }
  }

  // Submit all tasks
  for (var index = 0; index < list_task_UUIDs.length; index ++) {
    submitTaskTickets(list_task_UUIDs[index]);
  }

  // Update Table data
  updateTalbeData();

  // Get personal weight
  var new_personal_node = [];
  for (var index = 0; index < list_task_UUIDs.length; index++) {
    // Get task info
    if (getLocalStorage(list_task_UUIDs[index]) === "") {
      continue;
    }

    // Add nodes
    obj = JSON.parse(getLocalStorage(list_task_UUIDs[index]));
    try {
      for (var index_sdgs = 1; index_sdgs < 28; index_sdgs++) {
        if (obj.ticket["s" + index_sdgs] != "0") {
          // { id: "personal"   , group: 18, label: "personal"   , level: 4 },

          var obj_personal = {};
          obj_personal.id = "personal-" + index.toString() + index_sdgs.toString();
          obj_personal.group = 18;
          obj_personal.label = "個人";
          baseNodes.push(obj_personal);

          var obj_new_node = {}
          obj_new_node.nodeid = obj_personal.id;
          obj_new_node.source = index_sdgs;
          new_personal_node.push(obj_new_node);
        }
      }
    } catch(e) {console.log(e)}
  }

  // Get project weight
  var projectWeight = {};

  for (var index = 0; index < list_task_UUIDs.length; index++) {
    var weight = getProjectWeight(list_task_UUIDs[index]);
    projectWeight = addWeight(projectWeight, weight);
  }

  var new_project_node = [];
  try {
    for (var index = 1; index < 28; index++) {
      if (projectWeight["sdgs-" + index] != "0") {
        // Add nodes
        for (var index_nodes_counts = 0; index_nodes_counts < parseInt(projectWeight["sdgs-" + index]); index_nodes_counts++) {
          // { id: "cumulative"   , group: 19, label: "專案"   , level: 4 },
          var obj_project = {};
          obj_project.id = "cumulative-" + index.toString() + index_nodes_counts.toString();
          obj_project.group = 19;
          obj_project.label = "專案";
          obj_project.level = 4;
          baseNodes.push(obj_project);

          var obj_new_node = {}
          obj_new_node.nodeid = obj_project.id;
          obj_new_node.source = index;
          new_project_node.push(obj_new_node);
        }
      }
    }
  } catch (e) {
    console.log(e)
  }

  // Updating links
  // { target: "SDG-1", source: "C" , strength: 0.5 }, 
  for (var index = 0; index < new_personal_node.length; index++) {
    obj = new_personal_node[index];

    var obj_personal = {};
    obj_personal.target = obj.nodeid ;
    obj_personal.source = "SDG-" + obj.source.toString();
    obj_personal.strength = 0.5;
    baseLinks.push(obj_personal);
  }

  for (var index = 0; index < new_project_node.length; index++) {
    obj = new_project_node[index];

    var obj_project = {};
    obj_project.target = obj.nodeid ;
    obj_project.source = "SDG-" + obj.source.toString();
    obj_project.strength = 0.5;
    baseLinks.push(obj_project);
  }

  return [baseNodes, baseLinks];
}

function updateTalbeData() {
  // Get user tasks
  var str_list_task_UUIDs = getLocalStorage("list_tasks");
  var list_task_UUIDs = [];
  if (str_list_task_UUIDs === "") {
    var resultJSON = {};
    resultJSON = get_user_uuid_tasks(getLocalStorage("email"));

    try {
      list_task_UUIDs = resultJSON.uuid;
    } catch(e) { console.log(e); }

  } else {
    try {
      list_task_UUIDs = str_list_task_UUIDs.split(",");
    } catch (e) { console.log(e); return; };
  }

  var list_child_tasks = [];
  
  for (var index = 0; index < list_task_UUIDs.length; index ++) { 
    list_child_tasks.push(get_child_tasks(list_task_UUIDs[index]));
  }

  // Project weight
  var projectWeight = {};

  for (var index = 0; index < list_task_UUIDs.length; index++) {
    var weight = getProjectWeight(list_task_UUIDs[index]);
    projectWeight = addWeight(projectWeight, weight);
  }

  try {
    for (var index = 1; index <= 27; index ++) {
      document.getElementById("project_s" + index).innerHTML = projectWeight["sdgs-" + index];  
    }
  } catch(e) {
    console.log(e);
  }

  // Personal
  try {
    // Check if user join the task in task page
    var uuid_target = getLocalStorage("target");
    if (uuid_target == "") {
      return;
    }

    var str_obj_task = getLocalStorage(uuid_target);

    var obj_target = {}
    try {
      obj_target = JSON.parse(str_obj_task);
    } catch (e) {
      console.log(e);
      return;
    }
    
    var obj_ticket = obj_target.ticket;

    for(var index = 1; index <= 27; index++) {
      // Check SDGs
      if (obj_ticket["s" + index.toString()] != "1") {
        continue;
      }

      document.getElementById("person_s" + index).innerHTML = (parseInt(document.getElementById("person_s" + index).innerHTML) + parseInt(obj_target.ticket["s" + index ]) ).toString();
    }
  } catch (e) {
    console.log(e)
  }
}