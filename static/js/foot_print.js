function draw_associate_did(baseNodes, baseLinks)
{
  var str_list_tasks = getCookie("list_tasks");
  if (str_list_tasks === "") {
    // Redirect to issue page
    window.location.replace("/issues.html");
  }

  var list_tasks = str_list_tasks.split(",");
  var new_personal_node = [];
  for (var index = 0; index < list_tasks.length; index++) {
    // Get task info
    obj = JSON.parse(getCookie(list_tasks[index]));
    
    for (var index_sdgs = 1; index_sdgs < 18; index_sdgs++) {
      if (obj.ticket["s" + index_sdgs] != "0") {
        // { id: "personal"   , group: 18, label: "personal"   , level: 4 },
        var obj_personal = {};
        obj_personal.id = "personal-" + index.toString() + index_sdgs.toString();
        obj_personal.group = 18;
        obj_personal.label = "個人";
        obj_personal.level = 4;
        baseNodes.push(obj_personal);

	var obj_new_node = {}
	obj_new_node.nodeid = obj_personal.id;
	obj_new_node.source = index_sdgs;
	new_personal_node.push(obj_new_node);
      }
    }
  }
  
  // Adding nodes: project
  task_ticket_submit(list_tasks, 0);
  var obj_project_weight = JSON.parse(getCookie("project_weight"));
  var new_project_node = [];
  for (var index = 1; index < 18; index++) {
    if (obj_project_weight["sdgs-" + index] != "0") {
	// Add nodes
	for (var index_nodes_counts = 0; index_nodes_counts < parseInt(obj_project_weight["sdgs-" + index]); index_nodes_counts++) {
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

function set_page_info(total_weight, list_task_uuid) {
  for (var index = 1; index < 18; index ++) {
    document.getElementById("project_s" + index).innerHTML = total_weight["sdgs-" + index];

    for (var index_task = 0; index_task < list_task_uuid.length;  index_task++) {
      obj = JSON.parse(getCookie(list_task_uuid[index_task]));
      document.getElementById("persion_s" + index).innerHTML = (parseInt(document.getElementById("persion_s" + index).innerHTML) + parseInt(obj.ticket["s" + index ]) ).toString();
    }
  }
}

function task_ticket_submit(uuid_task, set_page = 1) {
  if (getCookie(uuid_task[0]) === "") {
    for (var index = 0; index < uuid_task.length; index++) {
      get_task_info(uuid_task[index], 0);
    }
  }

  obj = JSON.parse(getCookie(uuid_task[0]));
  var dataJSON = {"uuid": uuid_task[0],"sdgs-1":obj.ticket.s1,"sdgs-2":obj.ticket.s2,
	  "sdgs-3":obj.ticket.s3,"sdgs-4":obj.ticket.s4,"sdgs-5":obj.ticket.s5,
	  "sdgs-6":obj.ticket.s6,"sdgs-7":obj.ticket.s7,"sdgs-8":obj.ticket.s8,
	  "sdgs-9":obj.ticket.s9,"sdgs-10":obj.ticket.s10,"sdgs-11":obj.ticket.s11,
	  "sdgs-12":obj.ticket.s12,"sdgs-13":obj.ticket.s13,"sdgs-14":obj.ticket.s14,
	  "sdgs-15":obj.ticket.s15,"sdgs-16":obj.ticket.s16,"sdgs-17":obj.ticket.s17};
   
  $.ajax({
    url: "https://tplanet-backend.townway.com.tw/tasks/submit",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Set project weight to cookie
       setCookie("project_weight", returnData, 1);

       // Set page info
       if (set_page === 1) {
         set_page_info(obj, uuid_task);
       }
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
}

function submit_weight() {
  var list_issues = [];
  var dataJSON = {};
  dataJSON.username = getCookie("username");
  $.ajax({
    url: "https://eid-backend.townway.com.tw/tasks/list",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Submit ticket
       task_ticket_submit(obj.uuid);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
}
