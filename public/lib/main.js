$('document').ready(function() {
	/* man, this is so hax. looking for a better solution :) */
	if (window.opener || (window.locationbar && !window.locationbar.visible)) {
		$('#header-menu, .forum-header').hide();
		$('body').css('paddingTop', '65px');

		var ajaxifyGo = ajaxify.go;

		ajaxify.go = function(url, callback, quiet) {
			if (url !== 'register' && url !== 'login') window.close();
			return ajaxifyGo(url, callback, quiet);
		};
	}
});