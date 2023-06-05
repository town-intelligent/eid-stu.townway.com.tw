function signin(dataJSON) {
  var resultJSON = {};
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/signin",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      var elemWrongPw = document.getElementById("wrong-pw");
      if (elemWrongPw != null) {
        elemWrongPw.style.display = "block";
      }
      console.log(thrownError);
    }
  });
  return resultJSON;
}

function signup(dataJSON) {
  var resultJSON = {};
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/signup",
    type: "POST",
    crossDomain: true,
    async: false,
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

function change_pw(dataJSON) {     
  var resultJSON = {};   
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/modify",
    type: "POST",
    crossDomain: true,
    async: false,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
}

function uploadAvatarImg(base64Img) {
  var dataJSON = {};
  var resultBool = false;
  dataJSON.email = getLocalStorage("email");
  dataJSON.img = base64Img;
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/modify",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      const obj = JSON.parse(returnData);
      if (obj.result) {
        resultBool = true;
      } else {
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

function modify_username(username) {
  // Modify account
  var dataJSON = {};
  var retultJSON = {};
  dataJSON.email = getLocalStorage("email");
  dataJSON.username = username;
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/modify",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      retultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return retultJSON;
}

function getAccountAvatarImg() {
  var dataJSON = {};
  var resultJSON = {};
  dataJSON.email = getLocalStorage("email");
  
  $.ajax({
    url: HOST_URL_EID_DAEMON + "/accounts/get_avatar_img",
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