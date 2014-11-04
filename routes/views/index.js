var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'scoreboard';
	locals.current.sortOrder = req.query.sort || 'name.first';
	
	
	// LOAD the Players
	
	view.on('init', function(next) {
		keystone.list('User').model.find()
			.where('state', 'active')
			.sort(locals.current.sortOrder)
			.exec(function(err, players) {
				locals.players = players;
				next();
			});
	});

	view.render('index');
	
};
