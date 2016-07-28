var serviceApplicationId = "BW08vTW8wW.bluetoothleservice";
var remotePort;

tizen.application.launch(serviceApplicationId, function() {
		console.log("Service started");
		setTimeout(function(){
			console.log("RemotePort");
			remotePort = tizen.messageport.requestRemoteMessagePort(serviceApplicationId, "BLE_NATIVE");
		}, 1000);
		
	}, function() {
		console.error("Service failed");
	});


window.onload = function() {
	console.log("ONLOAD");

	var localPort = tizen.messageport.requestLocalMessagePort("BLE_WEB");

	var localPortWatchId = localPort.addMessagePortListener(function(data,
			replyPort) {
		for (var i = 0; i < data.length; i++) {
			console.log("key:" + data[i].key + " / value:" + data[i].value);
		}
		if (replyPort) {
			console.log("replyPort given: " + replyPort.messagePortName);
		}
	});

	$("#scan").click(function() {
		console.log("CLICK");
		console.log(remotePort);
		remotePort.sendMessage([ {
			key : "command",
			value : "startScan"
		} ]);
	});

	$("#adv").click(function() {
		console.log("CLICK");

		console.log(remotePort);
		remotePort.sendMessage([ {
			key : "command",
			value : "setAdv"
		} ]);
	});

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};