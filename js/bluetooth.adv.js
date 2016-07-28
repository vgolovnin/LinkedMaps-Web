var remotePort;



	var localPort = tizen.messageport.requestLocalMessagePort("BLE_WEB");	
	var serviceApplicationId = "BW08vTW8wW.bluetoothleservice";
	
	tizen.application.launch(serviceApplicationId, function(){
		console.log("Service started");
	}, function()
	{
		console.error("Service failed");
	});
	
	
	var localPortWatchId = localPort.addMessagePortListener(function(data, replyPort) 
	{
		   for (var i = 0; i < data.length; i++)
		   {
		      console.log("key:" + data[i].key + " / value:" + data[i].value);
		   }
		   if (replyPort) 
		   {
		      console.log("replyPort given: " + replyPort.messagePortName);
		   }
	});

	//var 
	remotePort = tizen.messageport.requestRemoteMessagePort(serviceApplicationId, "BLE_NATIVE");
	
$("#scan").click(function(){	
	remotePort.sendMessage([{key:"command", value:"startScan"}]);
});

$("#adv").click(function(){	
	remotePort.sendMessage([{key:"command", value:"setAdv"}]);
});
