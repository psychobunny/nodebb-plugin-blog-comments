(function() {
	"use strict";

	function loadScript(url, callback){
	    var script = document.createElement("script")
	    script.type = "text/javascript";

	    if (script.readyState && callback){  //IE
	        script.onreadystatechange = function(){
	            if (script.readyState == "loaded" ||
	                    script.readyState == "complete"){
	                script.onreadystatechange = null;
	                callback();
	            }
	        };
	    } else if (callback) {  //Others
	        script.onload = function(){
	            callback();
	        };
	    }

	    script.src = url;
	    document.getElementsByTagName("head")[0].appendChild(script);
	}

	function loadCSS(url) {
		var stylesheet = document.createElement("link");
		stylesheet.setAttribute("rel", "stylesheet");
		stylesheet.setAttribute("type", "text/css");
		stylesheet.setAttribute("href", url);
		document.getElementsByTagName("head")[0].appendChild(stylesheet);
	}

	loadCSS(nbb.url + '/plugins/nodebb-plugin-blog-comments2/css/comments.css');

	// fix youtube embed video
	if (window.jQuery) {
		loadScript(nbb.url + '/plugins/nodebb-plugin-youtube-embed/static/lib/lazyYT.js');
		loadCSS(nbb.url + '/plugins/nodebb-plugin-blog-comments2/css/youtube-embed-video.css');
	}

	var posDiv = document.getElementById('nodebb-comments');
	loadScript(nbb.url + '/plugins/nodebb-plugin-blog-comments2/lib/common.js', function () {
		blogComments2Common(posDiv, nbb);
	});

}());
