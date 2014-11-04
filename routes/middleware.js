var _ = require('underscore'),
	querystring = require('querystring'),
	keystone = require('keystone');


/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;

	locals.current = {
		user: req.user
	};

	locals.defaults = {
		dateFormat: 'D MMM YYYY',
		dateTimeFormat: 'h:mma D MMM YYYY',
		resultsPerPage: 50,
		maxPages: 10
	}
	
	locals.basedir = keystone.get('basedir');
	
	locals.qs_set = qs_set(req, res);

	locals.thsort_url = thsort_url(req, res);
	locals.thsort_class = thsort_class(req, res);
	locals.thsort_title = thsort_title(req, res);
	
	next();
	
};


/**
	Functions for sorting table columns. Each function represents an attribute
*/
var thsort_url = exports.thsort_url = function(req, res) {
	var locals = res.locals;
	// clear the page query when the user changes the sort column
	return function thsort_url(key) { return locals.qs_set({ page: undefined, sort: ( locals.current.sortOrder == key ? '-' + key : key )}) }
}
var thsort_class = exports.thsort_class = function(req, res) {
	var locals = res.locals;
	return function thsort_class(key) { return (locals.current.sortOrder == key) ? 'th-sort--desc' : (locals.current.sortOrder == '-' + key) ? 'th-sort--asc' : null };
}
var thsort_title = exports.thsort_title = function(req, res) {
	var locals = res.locals;
	return function thsort_title(key, name, title) { return ('Sort by ' + (title || name)) + (locals.current.sortOrder == key ? ' (asc)' : ' (desc)') };
}


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('info', 'Please sign in to access this page.');
		res.redirect('/keystone/signin?from=' + req.path);
	} else {
		next();
	}
	
};


/**
	Returns a closure that can be used within views to change a parameter in the query string
	while preserving the rest.
*/

var qs_set = exports.qs_set = function(req, res) {
	
	return function qs_set(obj) {
		
		var params = _.clone(req.query);
		
		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}
		
		var qs = querystring.stringify(params);
		
		return req.path + (qs ? '?' + qs : '');
		
	}
	
}
