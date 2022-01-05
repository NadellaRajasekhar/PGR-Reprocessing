/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"compgr.suspence./project1_pgr/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
