/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["com/pgr/suspence/project1pgr/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
