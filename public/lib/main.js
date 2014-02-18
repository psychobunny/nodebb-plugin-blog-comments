$('document').ready(function() {
	if (window.opener && window.location.hash === "#blog/authenticate") {
		$('#header-menu, .forum-header').hide();
		$('body').css('paddingTop', '65px');

		var ajaxifyGo = ajaxify.go;

		ajaxify.go = function(url, callback, quiet) {
			if (url !== 'register' && url !== 'login') window.close();
			return ajaxifyGo(url, callback, quiet);
		};
	}
});