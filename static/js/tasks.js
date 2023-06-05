
function get_user_uuid_tasks(email) {
  var dataJSON = {};
  var resultJSON = {};
  dataJSON.email = email;
  dataJSON.task_type = "0";
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/tasks/list",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

function get_task_description(uuid) {
  var dataJSON = {};
  var resultJSON = {};
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/get/" + uuid,
    type: "GET",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
    }
  });
  return resultJSON;
}

function get_child_tasks(uuid) {
  var dataJSON = {};
  var resultJSON = {};
  dataJSON.uuid = uuid;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/get_child_tasks",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON.task;
}

function get_parent_task(uuid) {
  var dataJSON = {};
  var resultJSON = {};
  dataJSON.uuid = uuid;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/get_parent_task",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON.task;
}

function get_task_status(uuid) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.uuid = uuid;
  dataJSON.email = getLocalStorage("email");

  $.ajax({
    url: HOST_URL_EID_DAEMON + "/tasks/get_task_status",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

function cal_progress(uuid) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.uuid = uuid;
  dataJSON.email = getLocalStorage("email");

  $.ajax({
    url: HOST_URL_EID_DAEMON + "/tasks/cal_progress",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

function task_save(obj_task) {
  var dataJSON = {};
  var resultText = "";
  var resultBool = false;
  dataJSON.email = getLocalStorage("email");
  dataJSON.uuid = obj_task.uuid;

  $.ajax({
    url:  HOST_URL_EID_DAEMON + "/tasks/save",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      console.log(returnData);
      resultBool = true;
      resultText = returnData;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
      resultBool = false;
      resultText = xhr.responseText;
    }
  });
  return {"result":resultBool, "content":resultText};
}

function tasks_submit(dataJSON) {
  var resultJSON = {};
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/submit",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

function save_task_by_uuid(uuid_task) {
  var obj_result = {};
  $.ajax({
    url:  HOST_URL_TPLANET_DAEMON + "/tasks/get/" + uuid_task,
    type: "GET",
    async: false,
    crossDomain: true,
    success: function(returnData) {
      console.log(returnData);
      obj_result = JSON.parse(returnData);
      return obj_result;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return obj_result;
}