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