// Simulate config options from your production environment by
require('dotenv')().load();

// Require keystone
var keystone = require('keystone');

keystone.init({

	'name': 'PingPong Champion',
	'brand': 'PingPong Champion',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',

	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': '.{t~$dqT6x3I1n:fVVRVi/rF&FPy"$1A$3^;P;&G8Hz^`>-8o8tK/k>e&{>5q%Ep',
	'back url': '/',
	'signin redirect': '/',
	'signout redirect': '/',
	
	'basedir': __dirname

	// 'cloudinary config': process.env.CLOUDINARY_URL

});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'players': 'users',
	'games': 'games'
});

keystone.start();