(function(){
	var adapter = tizen.bluetooth.getLEAdapter();

	
	var serviceuuid = "1819"; /* 1819 is Location&Navigation UUID */ // 32-bit "5857-4d3f"
		
	var payload = {lat: 123.456, lon: 232.123};
	

	var ADV_MODE = "ADVERTISE"; // "SCAN_RESPONSE"
	var connectable = true;

	
	var advertiseData = new tizen.BluetoothLEAdvertiseData(
			{
			   includeName: true,
			   uuids: [serviceuuid],  
			   // solicitationuuids: [serviceuuid]
			});

			advertiseData = new tizen.BluetoothLEServiceData(serviceuuid, "15");
					
			
			adapter.startAdvertise(advertiseData, ADV_MODE,
			                       function onstate(state)
			                       {
			                          console.log("Advertising configured: " + state);
			                       },
			                       function(error)
			                       {
			                          console.log("startAdvertise() failed: " + error.message);
			                       },
			                       "LOW_LATENCY", connectable);
			
			//adapter.stopScan();
	
}())