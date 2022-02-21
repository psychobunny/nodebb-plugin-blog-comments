'use strict';

define('admin/plugins/blog-comments', ['admin/settings'], function (Settings) {
	var admin = {};
	admin.init = function () {
		Settings.prepare();
	};
	return admin;
});
