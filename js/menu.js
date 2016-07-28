var page = document.querySelector("#mainPage"), handler = document
		.querySelector("#menuButton"), menuPage = document
		.querySelector("#menuPage"), selector = document
		.getElementById("menuSelector"), clickBound, routesPopup = document
		.querySelector("#routesPopup"), routesMain = document
		.querySelector("#routesMain"), searchByAddressPage = document
		.querySelector("#searchByAddressPage"),

STATE = {
	MAIN_MAP : 1,
	SELECTING_ROUTE : 2,
	SHOWING_ROUTE : 3,
	SEARCHING_BY_ADDRESS : 4
}, AppState = STATE.MAIN_MAP;

/**
 * pagebeforeshow event handler Do preparatory works and adds event listeners
 */

function menuButtonClickedHandler() {
	console.log("menu clicked");
	document.removeEventListener("rotarydetent", mapRotaryListener);

	tau.changePage(menuPage);
}
function menuItemClickedHandler(event) {
	var target = event.target;

	if (target.classList.contains("ui-selector-indicator"))
		menuItemWasSelected(parseInt($("#menuSelector > [data-index]").attr(
				"data-index")));
	console.log("clicked menu item");
}

function mapRotaryListener(ev) {
	var dir = ev.detail.direction;
	if (dir === "CW") {
		map.zoomIn();

	} else if (dir === "CCW") {

		map.zoomOut();

	} else {
		alert("SMTH WRONG");
	}
}

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

function closeMenu() {
	console.log("closing menu");
	tau.changePage(mainPage);
}
var MENU_ITEMS = {
	BACK : 0,
	SEARCH : 1,
	ROUTES : 2
};
function menuItemWasSelected(itemIndex) {
	switch (itemIndex) {
	case MENU_ITEMS.BACK:
		closeMenu();
		break;
	case MENU_ITEMS.SEARCH:
		AppState = STATE.SEARCHING_BY_ADDRESS;
		tau.changePage("#searchByAddressPage");
		break;
	case MENU_ITEMS.ROUTES:
		AppState = STATE.SELECTING_ROUTE;
		tau.changePage("#routesMain");
		// tau.openPopup(routesPopup);

		break;
	}
	console.log(itemIndex);
}
function clearMap() {
	if (markers.length > 0) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].remove();
		}
		markers = [];
	}
	if (buildedRoute !== null) {
		buildedRoute.remove();
		buildedRoute = null;
	}

}
function selectGeoByClick(callback) {
	clearMap();
	$("#moreButton").css({
		"display" : "none"
	});
	map.off('contextmenu');
	map.off('click');
	map.on('click', function(e) {
		getAddresByLatLng(e.latlng, callback);
	});
	tau.changePage("#mainPage");
}

function getAddresByLatLng(latlng, callback) {
	https:
	// maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
	var gurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
			+ latlng.lat + "," + latlng.lng
			+ "&language=ru&key=AIzaSyCwvaliAwCgmY4X2aD6ITITkzZ8tGYkjGU";
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
function validateRoute() {
	var validated = $("#addrInputB").val().length > 0
			&& $("#addrInputA").val().length > 0;
	console.log("validated= " + validated);
	return validated;
}
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