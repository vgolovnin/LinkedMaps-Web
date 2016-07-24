(function(){
	
	function successcallback(device)
	{
	   console.log("Found device: " + device.name + " [" + device.address + "]");
	   
	   console.log("Service data payload: " + device.serviceData.data);
	};
	
	
	var adapter = tizen.bluetooth.getLEAdapter();
	
	adapter.startScan(successcallback);
	
	// adapter.stopScan();
}())