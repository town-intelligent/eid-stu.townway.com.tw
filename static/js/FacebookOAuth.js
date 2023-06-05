function eIDFacebookLogin(input_token, res) {
  setLocalStorage("email", res.email);
  // Oauth to eID
  var dataJSON = {};
  var resultJSON = {};
  dataJSON.email = res.email 
  dataJSON.username = res.username
  dataJSON.token = input_token
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/oauth/facebook",
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
