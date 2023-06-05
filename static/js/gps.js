function gps_set(lat, lon, uuid_task) {
  var dataJSON = {};
  dataJSON.lat = lat;
  dataJSON.lon = lon;
  dataJSON.uuid_task = uuid_task;
  dataJSON.email = getLocalStorage("email");

  var resultJSON = {};

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/projects/gps_set",
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
