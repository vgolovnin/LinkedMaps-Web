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
var lastStampRecieved = -1;
var routeFromPhone = {"pointA": null, 
					  "pointB" : null};

function getMsg(data, replyPort) 
{
	var msg = {}
	console.log("MESSSAGE WAS RECIEVED");
	
	for (var i = 0; i < data.length; i++) {
		msg[data[i].key] =  data[i].value;	
	}
	console.log(msg);
	if (lastStampRecieved===msg.stamp) 
		return;
	
	switch(msg.command){
	case "0":
		onGeoRecieved([parseFloat(msg.lat), parseFloat(msg.lng)]);
		break;
	case "1":
		routeFromPhone.pointA = { lat: parseFloat(msg.lat), lng: parseFloat(msg.lng) } ;
		break;
	case "2":
		routeFromPhone.pointB = { lat: parseFloat(msg.lat), lng: parseFloat(msg.lng) };
		break;
	case "3": 
		var page = document
		.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id
		: "";
		console.log("BUILDING ROUTE");
		buildRoute(routeFromPhone.pointA, routeFromPhone.pointB);
		navigator.vibrate(1500);
		if (page !== "mainPage")
			tau.changePage("#mainPage");
		
		break;
	}

 
	lastStampRecieved = msg.stamp;
	
	
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
	
};