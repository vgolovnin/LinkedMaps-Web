var GOOGLE_API_KEY = "AIzaSyCwvaliAwCgmY4X2aD6ITITkzZ8tGYkjGU";
function getAddresByLatLng(latlng, callback) {
  // maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
	var gurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
			+ latlng.lat + "," + latlng.lng
			+ "&language=ru&key="+GOOGLE_API_KEY;
	sendingQuery(gurl, function(response){
		callback(latlng, response);
	});
}
function moreAboutPlace(googlePlaceId){
	var gurl = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ googlePlaceId+"&key="+GOOGLE_API_KEY;
	console.log("sending query " + gurl);
	sendingQuery(gurl, function(response){
		console.log(response);	
	});
}

function showNearestPlaces(type, location){
	var gurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+location+"&radius=1000&types="+type+"&key="+GOOGLE_API_KEY;
	sendingQuery(gurl, function(response){
		console.log(response);
		if (response.status!=="OK")
			{
			console.log(response.status);
			return;
			}
		
		for (var i = 0; i < response.results.length; i++){
			var curPlace = response.results[i];
			var newMarker = DG.marker(curPlace.geometry.location);
			var popup = DG.popup();
			popup.setFooterContent(curPlace.vicinity);
			var additionalInfo = "";
			if (popup.hasOwnProperty("opening_hours")) { 
				var additionalInfo = (curPlace.opening_hours.open_now?"Открыто":"Закрыто" ) + " " + curPlace.opening_hours.weekday_text;
 			}
			popup.setContent(additionalInfo + "\n" + curPlace.name);

			newMarker.addTo(map).bindPopup(popup); 
			nearestPlacesMarkers.push(newMarker);
		}
		
		
	});
}

function sendingQuery(query, callback){
	console.log("sending query " + query);
	$.ajax({
		type : "json",
		method : "GET",
		url : query
	    }).done(callback).fail(function(err) {
		   console.log(err);
		}
	);
}


function buildRoute(fromLatLng, toLatLng, on_finish, fake){
	var from = fromLatLng.lat + "," + fromLatLng.lng;
	to = toLatLng.lat + "," + toLatLng.lng,
	gurl = "https://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&language=ru&region=ru&key="
	sendingQuery(gurl, function(response){
		routeApiResult(response,on_finish, fake);
	});
	AppState = STATE.NAVIGATING;
}