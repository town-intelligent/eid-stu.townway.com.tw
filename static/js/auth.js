// Verify JWT
function verifyToken(token) {
  var resultBool = false;
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
        resultBool = true;
      } else {
        console.log("JWT expired");
        resultBool = false;
      }
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
      resultBool = false;
    }
  });
  return resultBool; 
}

function checkAuth() {
  if (getLocalStorage("jwt") == "") {
    console.log("Null value of JWT");
    var path = window.location.pathname;
    var page = path.split("/").pop();

    if (page != "signin.html" || page != "signup.html") {
      window.location.replace("/accounts/signin.html");
    }

  } else {
    // Verify token
    var resultBool = false;
    resultBool = verifyToken(getLocalStorage("jwt"));

    if (resultBool == false) {
      window.location.replace("/accounts/signin.html");
    }
  }
}
