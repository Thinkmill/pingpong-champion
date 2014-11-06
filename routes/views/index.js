var keystone = require('keystone'),
	User = keystone.list('User'),
	Game = keystone.list('Game');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'scoreboard';
	locals.current.sortOrder = req.query.sort || 'rank';
	
	
	// CREATE a Game
	
	view.on('post', { action: 'game.create' }, function(next) {
		
		var newGame = new Game.model();
		
		var updater = newGame.getUpdateHandler(req);
		
		updater.process(req.body, {
			fields: 'player1, player2, player1Score, player2Score',
			required: 'player1, player2, player1Score, player2Score',
			errorMessage: 'There was an error creating the game:',
			flashErrors: true,
			logErrors: true
		}, function(err) {
			
			if (err) {
				locals.validationErrors = err.errors;
				return next();
			} else {
				req.flash('success', 'New game ' + newGame.name + ' saved successfully.');
				
				// redirect so we load the new game
				res.redirect('/');
			}
		
		});
	
	});
	
	
	// LOAD the Players after post so we get the latest data
	
	view.on('render', function(next) {
		User.model.find()
			.where('state', 'active')
			.sort(locals.current.sortOrder)
			.exec(function(err, players) {
				locals.players = players;
				next();
			});
	});

	view.render('index');
	
};
