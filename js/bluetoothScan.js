var serviceApplicationId = "BW08vTW8wW.bluetoothleservice";
var remotePort;


function setAdv(command, lat, lng, stamp)
{
	remotePort.sendMessage([{
		key : "command",
		value : command // string
	} , 
	{
		key: "lat",
		value: lat // string
	} ,
	{
		key: "lng",
		value: lng // string
	},
	{
		key: "stamp",
		value: stamp // string
	}]);
}

function stopAdv()
{
	remotePort.sendMessage([{
		key : "command",
		value : "stopAdv"
	}]);
}

function startScan()
{
	remotePort.sendMessage([ {
		key : "command",
		value : "startScan"
	} ]);
}

function stopScan()
{
	remotePort.sendMessage([ {
		key : "command",
		value : "stopScan"
	} ]);
}

function getMsg(data, replyPort) 
{
	for (var i = 0; i < data.length; i++) {
		console.log("key:" + data[i].key + " / value:" + data[i].value);
	}
	if (replyPort) {
		console.log("replyPort given: " + replyPort.messagePortName);
	}
}

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

	var localPortWatchId = localPort.addMessagePortListener(getMsg);

	$("#scan").click(function() {
		console.log("CLICK");
		console.log(remotePort);
		startScan();
	});
	
	$("#stopscan").click(function(){
		console.log("CLICK");
		console.log(remotePort);
		stopScan();
	});

	$("#adv").click(function() {
		console.log("CLICK");

		console.log(remotePort);
		setAdv();
	});
	
	$("#stopadv").click(function(){
		stopAdv();
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