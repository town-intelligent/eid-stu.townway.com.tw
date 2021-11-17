// Verify JWT
function verifyToken(token) {
    var dataJSON = {};
    dataJSON.token =  token;
    $.ajax({
      url: "https://eid-backend.townway.com.tw/accounts/verify_jwt",
      type: "POST",
      async: false,
      crossDomain: true,
      data:  dataJSON,
      success: function(returnData) {
        const obj = JSON.parse(returnData);
        if (obj.result) {
          console.log("JWT still avliable");
	  return true;
        } else {
	  console.log("JWT expired");

          // Localhost only
          // window.location.replace("/signin.html");

          // Git page
          window.location.replace("/accounts/signin.html");

        }
      },
      error: function(xhr, ajaxOptions, thrownError){
        console.log(thrownError);
      }
    }); 
}

function checkAuth() {
  if (getCookie("jwt") == "") {
    console.log("Null value of JWT");
    var path = window.location.pathname;
    var page = path.split("/").pop();

    if (page != "signin.html" || page != "signup.html") {
      console.log("Goto signin page");

      // Localhost only
      // window.location.replace("/signin.html");

      // Git page
      window.location.replace("/accounts/signin.html");
    }

  } else {
    // Verify token
    console.log("Verifing JWT ...");
    verifyToken(getCookie("jwt"));
  }
}
