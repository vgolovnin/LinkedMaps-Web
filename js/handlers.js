handler.addEventListener("click", menuButtonClickedHandler);
page.addEventListener("pagebeforeshow", function() {
	console.log("showing MAIN PAGE");

	document.addEventListener("rotarydetent", mapRotaryListener);
	if (AppState === STATE.MAIN_MAP && map != null) {
		 
		map.off("contextmenu");
		addLongTapListener();
	}
	if (AppState === STATE.SHOWING_ROUTE)
		$("#goButton").css({
			"display" : "block"
		});
	else
		$("#goButton").css({
			"display" : "none"
		});

});
page.addEventListener("pagebeforehide", function() {
	console.log("HIDING MAIN PAGE");
	document.removeEventListener("rotarydetent", mapRotaryListener);
	// if (AppState === STATE.SELECTING_ROUTE) {
	$("#moreButton").css({
		"display" : "block"
	});
	// }
});

menuPage.addEventListener("pagebeforeshow", function() {

	clickBound = menuItemClickedHandler.bind(null);
	tau.widget.Selector(selector);
	selector.addEventListener("click", clickBound, false);

	/*
	 * var radius = window.innerHeight / 2 * 0.8;
	 * 
	 * clickHandlerBound = menuClickedHandler.bind(null);
	 * handler.addEventListener("click", clickHandlerBound); if
	 * (tau.support.shape.circle) { selector = tau.widget.Selector(elSelector, {
	 * itemRadius : radius }); }
	 */
});
menuPage.addEventListener("pagebeforehide", function() {
	selector.removeEventListener("click", clickBound, false);

	/*
	 * handler.removeEventListener("click", clickHandlerBound); if
	 * (tau.support.shape.circle) { selector.destroy(); }
	 */
});
routesMain.addEventListener("pagebeforeshow", function() {
	console.log("openning page routes main");
});
routesMain.addEventListener("pagebeforehide", function() {
	console.log("hiding page routes main");
});

$(".locationImage").on("click", function() {
	var self = $(this).parent().parent().find(".addrInputField");
	selectGeoByClick(function(latlng, revGeocodingResponse) {
		console.log(revGeocodingResponse);
		console.log("SETTING RESPONSE TO " + self.attr("id"));
		self.val(revGeocodingResponse.results[0].formatted_address);
		self.attr("data-lat", latlng.lat);
		self.attr("data-lng", latlng.lng);
		tau.back();
	});
});
$("#buildRouteButton").on("click", function() {
	if (validateRoute()) {
		var fromA = $("#addrInputA"), fromB = $("#addrInputB"), 
		
		pointA = {
			lat : fromA.attr("data-lat"),
			lng : fromA.attr("data-lng")
		}, 
		pointB = {
			lat : fromB.attr("data-lat"),
			lng : fromB.attr("data-lng")
		};
		buildRoute(pointA, pointB, function(){
			tau.changePage("#mainPage");
		});
		

	}
});


