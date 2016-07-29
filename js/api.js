var GOOGLE_API_KEY = "AIzaSyCwvaliAwCgmY4X2aD6ITITkzZ8tGYkjGU";
function getAddresByLatLng(latlng, callback) {
  // maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
	var gurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
			+ latlng.lat + "," + latlng.lng
			+ "&language=ru&key="+GOOGLE_API_KEY;
	console.log("sending query " + gurl);
	$.ajax({
		type : "json",
		method : "GET",
		url : gurl
	}).done(function(response) {
		callback(latlng, response)
	}).fail(function(err) {
		console.log(err);
	});
}
function moreAboutPlace(googlePlaceId){
	var gurl = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ googlePlaceId+"&key="+GOOGLE_API_KEY;
	console.log("sending query " + gurl);
	$.ajax({
		type : "json",
		method : "GET",
		url : gurl
	    }).done(function(response){
	    	console.log(response)
 	    }).fail(function(err) {
		   console.log(err);
		}
	    );
}

function buildRoute(fromLatLng, toLatLng, on_finish){
	var from = fromLatLng.lat + "," + fromLatLng.lng;
	to = toLatLng.lat + "," + toLatLng.lng,
	gurl = "https://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&language=ru&region=ru&key="
	console.log("sending query " + gurl);
	$.ajax({
	type : "json",
	method : "GET",
	url : gurl
    }).done(function(response){
	   routeApiResult(response,on_finish);
    }).fail(function(err) {
	   console.log(err);
	}
    );
	AppState = STATE.NAVIGATING;
}