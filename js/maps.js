!function(){"use strict";function e(){var e={skin:p.skin,pkg:p.pkg,version:l};/MSIE\x20(\d+\.\d+);/.test(navigator.userAgent)&&parseInt(RegExp.$1,10)<9&&(e.ie8=!0);var t=[];for(var n in e){var o=e[n];o&&t.push(n+"="+o)}return t.length?"?"+t.join("&"):""}function t(){s=!0;var e=document.createElement("script");e.setAttribute("type","text/javascript"),e.setAttribute("src",m+"/js/"+v),e.onerror=function(e){d(e)},document.getElementsByTagName("head")[0].appendChild(e)}function n(){return new Promise(function(e,t){function n(){document.addEventListener?(document.removeEventListener("DOMContentLoaded",n,!1),window.removeEventListener("load",n,!1)):(document.detachEvent("onreadystatechange",n),window.detachEvent("onload",n)),i||(i=!0,e())}function o(){if(!i){try{document.documentElement.doScroll("left")}catch(e){return void setTimeout(o,50)}n()}}var i=!1;if("loading"!==document.readyState)return n();if(document.addEventListener)document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",n),window.attachEvent("onload",n);var r=!1;try{r=null==window.frameElement}catch(a){}document.documentElement.doScroll&&r&&o()}})}function o(){var e=m+"/css/"+v,t=document.createElement("style");return t.type="text/css",new Promise(function(n,o){DG.ajax(e,{type:"get",dataType:"html",success:function(e){var o=document.getElementsByTagName("head")[0],i="http://maps.api.2gis.ru/2.0";m!==i&&(e=e.replace(new RegExp(i,"g"),m)),t.styleSheet?(o.appendChild(t),t.styleSheet.cssText=e):(t.appendChild(document.createTextNode(e)),o.appendChild(t)),n()},error:function(){o()}})})}function i(){var e=DG.config.protocol+DG.config.webApiServer+"/"+DG.config.webApiVersion+"/region/list";return new Promise(function(t){DG.ajax(e,{type:DG.ajax.corsSupport?"get":"jsonp",data:{format:DG.ajax.corsSupport?"json":"jsonp",key:DG.config.webApiKey,fields:DG.config.regionListFields},timeout:DG.config.loadProjectListTimeout,success:function(e){var n=e.result;n&&n.items&&n.items.length&&(DG.projectsList=n.items),t()},error:function(e){t()}})})}function r(){DG.extend(DG.config,{"webApiKey":"rubnkm7490","geoclickerCatalogApiKey":"ruxlih0718","protocol":"http:"})}function a(){return Promise.all([o(),i(),n()])}function c(){DG.ready=!0}function d(){for(var e=0,t=u.length;t>e;e++)"function"==typeof u[e]&&u[e]()}var s=!1,u=[],l="v3.0.1",m="http://maps.api.2gis.ru/2.0",p={"pkg":"full"},f="true"===p.lazy,v=e();window.DG=window.DG||{},window.DG.ready=!1,window.__dgApi__={callbacks:[[r,void 0],[a,void 0],[c,void 0]],version:l};var g=window.DG.then=function(e,n){return DG.then!==g?DG.then(e,n):(window.__dgApi__.callbacks.push([e,n]),f&&!s&&t(),n&&u.push(n),this)};f||t()}();


var map;
var markers = [];
var buildedRoute = null;
DG.then(function() {
	console.log("init map");
	map = DG.map('mmm', {
		center : [ 54.98, 82.89 ],
		zoom : 13,
		tap : true
	});
	DG.control.location({
		position : 'topright'
	}).addTo(map);
	map.locate({
		setView : true,
		watch : true
	}).on('locationfound', function(e) {
		DG.marker([ e.latitude, e.longitude ]).addTo(map);
	}).on('locationerror', function(e) {
		console.log(e.message);
		// alert("Location access denied.");
	});
 
	 
	console.log(map);
	 

	addLongTapListener();
	
});
function addLongTapListener(){
	map.on('contextmenu', function(e){
		var newMarker = DG.marker([ e.latlng.lat, e.latlng.lng ]);
		newMarker.addTo(map);
		markers.push(newMarker);
		
		if (markers.length ==2){
			 
			markers[0].remove();
			markers[1].remove();
			markers = [];
		}
		
		
		if (markers.length == 2){ 
			
			var m1 = markers[0], m2 = markers[1];
			
			buildRoute(m1.getLatLng(),m2.getLatLng());
			
			
		} 
		
		console.log("contextmenu " + e.latlng.lat + " "+ e.latlng.lng);
	});
}
function routeApiResult(response, on_finish){
	 var leg = response.routes[0].legs[0],
 	 steps = leg.steps;
	 clearMap();
	 drawRoute(steps);
	 if (on_finish !== null && typeof on_finish !== 'undefined')
		 on_finish();
	 
// var defVect = [0,1];
// var curVect = [steps[0].end_location.lat - steps[0].start_location.lat ,
// steps[0].end_location.lng - steps[0].start_location.lng];
// var scalarMult = curVect[1]; // defVect[0] == 0 && defVect[1] ==1
// function lenVect(vect){
// return Math.sqrt(vect[0]*vect[0] + vect[1] * vect[1]);
// }
// console.log(lenVect(curVect));
// console.log(scalarMult, (lenVect(curVect) * lenVect(defVect)));
// var angle = (Math.acos(scalarMult / (lenVect(curVect))) * 180) / Math.PI;
// console.log(angle);
//	
//
// rotateMap(angle);

	
}
 
function rotateMap(angle){
	var mapTag = document.getElementById("mmm");
	mapTag.style.webkitTransform = 'rotate('+angle+'deg)';
	console.log("rotating on angle " + angle);
	$("#mmm").css({"webkit-transform": "rotate("+angle+"deg)"});
	// $("mmm").rotate(angle);
}	
function drawRoute(steps){
	 
	 buildedRoute = DG.polyline([]).addTo(map);
	 for (var i = 0; i < steps.length; i++){
		 buildedRoute.addLatLng([steps[i].start_location.lat,steps[i].start_location.lng]);
		 buildedRoute.addLatLng([steps[i].end_location.lat,steps[i].end_location.lng]);

	 }
 
	 map.fitBounds([[steps[0].start_location.lat, steps[0].start_location.lng], [steps[steps.length - 1].end_location.lat,steps[steps.length - 1].end_location.lng]]);
	 map.zoomOut();
	

     console.log(steps)
}
function buildRoute(steps){
	drawRoute(steps);
	var m1 =DG.marker([ e.latitude, e.longitude ]), 
	    m2 = DG.marker([steps[steps.length - 1].end_location.lat,steps[steps.length - 1].end_location.lng]);
	 markers.push(m1,m2);
	 m1.addTo(map);
	 m2.addTo(map); 
 }
function buildRoute(fromLatLng, toLatLng, on_finish){
	var from = fromLatLng.lat + "," + fromLatLng.lng;
	to = toLatLng.lat + "," + toLatLng.lng,
	gurl = "https://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&language=ru&region=ru&key=AIzaSyCwvaliAwCgmY4X2aD6ITITkzZ8tGYkjGU"
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
}

