!function(){"use strict";function e(){var e={skin:p.skin,pkg:p.pkg,version:l};/MSIE\x20(\d+\.\d+);/.test(navigator.userAgent)&&parseInt(RegExp.$1,10)<9&&(e.ie8=!0);var t=[];for(var n in e){var o=e[n];o&&t.push(n+"="+o)}return t.length?"?"+t.join("&"):""}function t(){s=!0;var e=document.createElement("script");e.setAttribute("type","text/javascript"),e.setAttribute("src",m+"/js/"+v),e.onerror=function(e){d(e)},document.getElementsByTagName("head")[0].appendChild(e)}function n(){return new Promise(function(e,t){function n(){document.addEventListener?(document.removeEventListener("DOMContentLoaded",n,!1),window.removeEventListener("load",n,!1)):(document.detachEvent("onreadystatechange",n),window.detachEvent("onload",n)),i||(i=!0,e())}function o(){if(!i){try{document.documentElement.doScroll("left")}catch(e){return void setTimeout(o,50)}n()}}var i=!1;if("loading"!==document.readyState)return n();if(document.addEventListener)document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",n),window.attachEvent("onload",n);var r=!1;try{r=null==window.frameElement}catch(a){}document.documentElement.doScroll&&r&&o()}})}function o(){var e=m+"/css/"+v,t=document.createElement("style");return t.type="text/css",new Promise(function(n,o){DG.ajax(e,{type:"get",dataType:"html",success:function(e){var o=document.getElementsByTagName("head")[0],i="http://maps.api.2gis.ru/2.0";m!==i&&(e=e.replace(new RegExp(i,"g"),m)),t.styleSheet?(o.appendChild(t),t.styleSheet.cssText=e):(t.appendChild(document.createTextNode(e)),o.appendChild(t)),n()},error:function(){o()}})})}function i(){var e=DG.config.protocol+DG.config.webApiServer+"/"+DG.config.webApiVersion+"/region/list";return new Promise(function(t){DG.ajax(e,{type:DG.ajax.corsSupport?"get":"jsonp",data:{format:DG.ajax.corsSupport?"json":"jsonp",key:DG.config.webApiKey,fields:DG.config.regionListFields},timeout:DG.config.loadProjectListTimeout,success:function(e){var n=e.result;n&&n.items&&n.items.length&&(DG.projectsList=n.items),t()},error:function(e){t()}})})}function r(){DG.extend(DG.config,{"webApiKey":"rubnkm7490","geoclickerCatalogApiKey":"ruxlih0718","protocol":"http:"})}function a(){return Promise.all([o(),i(),n()])}function c(){DG.ready=!0}function d(){for(var e=0,t=u.length;t>e;e++)"function"==typeof u[e]&&u[e]()}var s=!1,u=[],l="v3.0.1",m="http://maps.api.2gis.ru/2.0",p={"pkg":"full"},f="true"===p.lazy,v=e();window.DG=window.DG||{},window.DG.ready=!1,window.__dgApi__={callbacks:[[r,void 0],[a,void 0],[c,void 0]],version:l};var g=window.DG.then=function(e,n){return DG.then!==g?DG.then(e,n):(window.__dgApi__.callbacks.push([e,n]),f&&!s&&t(),n&&u.push(n),this)};f||t()}();


var map;
 pinMarker = null,
 buildedRoute = null,
  currentPositionMarker = null, 
  routeBoundMarkers = [],
  nearestPlacesMarkers = [];
DG.then(function() {
	console.log("init map");
	map = DG.map('mmm', {
		center : [ 54.98, 82.89 ],
		zoom : 13,
		tap : true,
		fullscreenControl: false,
        zoomControl: false
	});
	
	addLongTapListener();
	console.log(map);
	startScan();
	 
	
	 


	
});
function addLongTapListener(){
	console.log("adding Long tap listener");
	map.on('contextmenu', function(e){
		if (pinMarker !== null){
			pinMarker.remove();
		}
		pinMarker = DG.marker([ e.latlng.lat, e.latlng.lng ]);
		var popup = DG.popup().setContent('<img src="img/loader2.gif" style="width=20px;heigth: 20px;"/>');
	   
		pinMarker.addTo(map).bindPopup(popup);    
		var markerDescr = null;
		pinMarker.on("popupopen", function(){
			console.log("popup opened");
			if (markerDescr === null)
				getAddresByLatLng(pinMarker.getLatLng(), function(latlng, response){
					if (response.status==="OK"){
						markerDescr = response;
						console.log(response);
						var buttonHref = (currentPositionMarker !== null) ? "<a href=\"#\" onclick=\"routeToMarker();\">Route here</a>" : "";
						popup.setContent("<span style=\"font-size=1em\">" + response.results[0].formatted_address + "</span>" + buttonHref);
					} else {
						console.log(response.status);
						console.log(response);
					}
					
				});
		});

		console.log("contextmenu " + e.latlng.lat + " "+ e.latlng.lng);
	});
}
function routeToMarker(){
	buildRoute(currentPositionMarker.getLatLng(), pinMarker.getLatLng());
	return false;
}

function fakerSegment(start_location, end_location, duration, j)
{
	if (j < 10)
	{
		setTimeout(function(){
			var current_location = {};
			current_location.lat = start_location.lat + (end_location.lat - start_location.lat) * ((j+1)/10.0);
			current_location.lng = start_location.lng + (end_location.lng - start_location.lng) * ((j + 1)/10.0);
			console.log("go " + current_location);
			onGeoRecieved(current_location);
			fakerSegment(start_location, end_location, duration, j+1);
		}, duration * 10);
	}
}
var step_number, STEPS;
function faker(steps, i, callback)
{	
	
	if (i < steps.length)
	{
		var duration = steps[i].duration.value;
		console.log([steps[i].start_location.lat,steps[i].start_location.lng]);
		


		fakerSegment(steps[i].start_location, steps[i].end_location, duration , 0);
		
		setTimeout(function(){
			console.log("waited for ", duration);
			
			// IN THE NODE
			controlPointAchieved(steps, i+1);
		
		}, duration * 101 + 200);
		
	}
	
}
function controlPointAchieved(steps, i){
	step_number = i;
	navigator.vibrate(300);
	STEPS = steps;
	if (i<steps.length - 1){ 
		$("#popupText").html(steps[i + 1].html_instructions);
	} else { 
		clearMap();
		$("#popupText").html("Маршрут завершен");
			
	}
    
	tau.changePage("#popupPage");
}
function popupOk(){
	faker(STEPS, step_number+1);
	
	tau.back();
}

function startFakeNavigation(steps)
{
	faker(steps, 0);
}



///INVOKE ONLY IN MAIN PAGE 
function routeApiResult(response, on_finish, fake){
	 var leg = response.routes[0].legs[0],
 	 steps = leg.steps;
	 
	 
	 clearMap();
		
	 buildedRoute = DG.polyline([]).addTo(map);
	 for (var i = 0; i < steps.length; i++){
		 buildedRoute.addLatLng([steps[i].start_location.lat,steps[i].start_location.lng]);
		 buildedRoute.addLatLng([steps[i].end_location.lat,steps[i].end_location.lng]);

	 }
 
	
	var m1 = DG.marker([steps[0].start_location.lat,steps[0].start_location.lng]), 
	    m2 = DG.marker([steps[steps.length - 1].end_location.lat,steps[steps.length - 1].end_location.lng]);
	 routeBoundMarkers.push( m1.addTo(map),m2.addTo(map));	 
	 map.fitBounds([[steps[0].start_location.lat, steps[0].start_location.lng], [steps[steps.length - 1].end_location.lat,steps[steps.length - 1].end_location.lng]]);
	 map.zoomOut();
	 
	 $("#goButton").css({"display":"block"});
	 
	 if (fake)
		 startFakeNavigation(steps);
	 
	 if (on_finish !== null && typeof on_finish !== 'undefined')
		 on_finish();
}


/*setTimeout(function(){
	onGeoRecieved([ 54.98, 82.89 ]);
	var latlng = currentPositionMarker.getLatLng();
	showNearestPlaces('food', latlng.lat + "," + latlng.lng);
},1000);	
*/
function onGeoRecieved(latlng){
  if(currentPositionMarker === null){
	  currentPositionMarker = 
	  
	  currentPositionMarker = DG.marker(latlng, {
           icon: DG.icon({
               		iconUrl: 'img/pos.png',
               		iconSize: [16, 16]
           	 	 })
      }).addTo(map);
  } else 
	  currentPositionMarker.setLatLng(latlng);
  map.setView(currentPositionMarker.getLatLng(), 15);
}
function clearMap() {
	
	if (pinMarker!==null){
		pinMarker.remove();
		pinMarker = null;
	}
	for (var i = 0; i < routeBoundMarkers.length; i++)
		routeBoundMarkers[i].remove();
	for (var j = 0; j < nearestPlacesMarkers.length; j++)
		nearestPlacesMarkers[j].remove();
	
	nearestPlacesMarkers = [];
	routeBoundMarkers = [];
	
	
	if (buildedRoute !== null) {
		buildedRoute.remove();
		buildedRoute = null;
	}

}
