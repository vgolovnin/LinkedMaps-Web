STATE = {
	MAIN_MAP : 1,
	SELECTING_ROUTE : 2,
	SHOWING_ROUTE : 3,
	SEARCHING_BY_ADDRESS : 4,
	NAVIGATING : 5 //when route is build and user pressed go button
}, AppState = STATE.MAIN_MAP;

/**
 * pagebeforeshow event handler Do preparatory works and adds event listeners
 */


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

function closeMenu() {
	console.log("closing menu");
	tau.changePage(mainPage);
}
var MENU_ITEMS = {
	BACK : 0,
	SEARCH : 1,
	ROUTES : 2
};

function selectGeoByClick(callback) {
	clearMap();
	$("#moreButton").hide();
	map.off('contextmenu');
	map.off('click');
	map.on('click', function(e) {
		getAddresByLatLng(e.latlng, callback);
		map.off('click');
	});
	tau.changePage("#mainPage");
}

function validateRoute() {
	var validated = $("#addrInputB").val().length > 0
			&& $("#addrInputA").val().length > 0;
	console.log("validated= " + validated);
	return validated;
}

