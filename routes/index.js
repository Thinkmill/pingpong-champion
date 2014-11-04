var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/*', middleware.requireUser);
	
	app.all('/', routes.views.index);
	
	app.all('/players', routes.views.players);
	app.all('/reports', routes.views.reports);
	app.all('/settings', routes.views.settings);	
};
