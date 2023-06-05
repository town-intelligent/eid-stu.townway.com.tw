function getProjectWeight(uuid_task) {
  var projectWeight = {};
  var dataJSON = {};
  dataJSON.uuid = uuid_task;//list_task_UUIDs[0];

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/projects/weight",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
      projectWeight = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return projectWeight;
}

function comment_project(dataJSON) {
  var resultJSON = false;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/projects/comment",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
      console.log(returnData);
      resultJSON = true;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
      resultJSON = false;
    }
  });
  return resultJSON;
}
