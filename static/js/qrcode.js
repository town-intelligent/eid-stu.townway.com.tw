function get_task(url) {
  var path = url.split("/");
  var uuid_task = path[4];

  var obj_task = {};
  try {
    obj_task = get_task_description(uuid_task);
  } catch (e) { 
    console.log(e); 
    window.location.replace("/issues.html");
  }

  // Save
  var resultJSON = {};
  try {
    resultJSON = task_save(obj_task);
  } catch (e) { 
    console.log(e); 
    alert("您掃描的 QR Code 可能有問題！請洽系統管理員！ (001)");
  }
  if (resultJSON.result == true) {
    window.location.replace("/issues.html");
  } else {
    // alert("您掃描的 QR Code 可能有問題！請洽系統管理員！ (002)");
    if (resultJSON.content == "Task exist already") {
      alert("任務已被重複領取，請確認永續合作頁面是否有該任務，謝謝。")
    } else {
      alert("這個任務不存在，請確認 QR Code 是否正確，謝謝。")
    }
  }
}

function analysis_url(url) {
  var path = url.split("/");
  return path[3];
}

// --- --- --- ---

function start_scanner(cameraId) {
  // Create instance of the object. The only argument is the "id" of HTML element created above.
  const html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start(
  cameraId, { // retreived in the previous step.
    fps: 10,    // sets the framerate to 10 frame per second
    qrbox: 250  // sets only 250 X 250 region of viewfinder to
                // scannable, rest shaded.
  },
  qrCodeMessage => {
    // do something when code is read. For example:
    // URL analysis
    var method = analysis_url(qrCodeMessage);
    if (method === "tasks") {
      get_task(qrCodeMessage);
    } else {
      alert("這個任務不存在，請確認 QR Code 是否正確，謝謝。")
    }
  },
  errorMessage => {
    // parse error, ideally ignore it. For example:
    console.log("QR Code no longer in front of camera.");
  })
  .catch(err => {
    // Start failed, handle it. For example,
    console.log(`Unable to start scanning, error: ${err}`);
  });
}

// This method will trigger user permissions
Html5Qrcode.getCameras().then(devices => {
  /**
   * devices would be an array of objects of type:
   * { id: "id", label: "label" }
   */
  if (devices && devices.length) {
    var cameraId = devices[devices.length-1].id;
    start_scanner(cameraId);
  }
}).catch(err => {
  alert("抱歉，您的相機不支援 QR Code 掃描器！")
});