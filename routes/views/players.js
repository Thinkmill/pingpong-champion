var keystone = require('keystone'),
	User = keystone.list('User'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;


	// SET the Locals
	
	locals.section = 'players';
	locals.headerbarLabel = 'Players';
	locals.moment = moment;

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

	
	// CREATE new User
	
	view.on('post', { action: 'player.create' }, function(next) {
		
		var newPlayer = new User.model();
		
		var updater = newPlayer.getUpdateHandler(req);
		
		updater.process(req.body, {
			fields: 'name, email, password, gender, dob',
			required: 'name, email, password, gender',
			errorMessage: 'There was an error creating the player:',
			flashErrors: true,
			logErrors: true
		}, function(err) {
			
			if (err) {
				locals.validationErrors = err.errors;
				return next();
			} else {
				req.flash('success', 'New player ' + newPlayer.name.full + ' created successfully.');
				
				// redirect so we load the new player
				res.redirect('/players');
			}
		
		});
	
	});


	// UPDATE a User
	
	view.on('post', { action: 'player.update' }, function(next) {
		
		keystone.list('User').model.findById(req.body.player).exec(function(err, player) {

			if (err) return res.err(err);
		
			var updater = player.getUpdateHandler(req);
			
			updater.process(req.body, {
				fields: 'name, email, gender, dob',
				required: 'name, email, gender',
				errorMessage: 'There was an error updating ' + player.name.full,
				flashErrors: true,
				logErrors: true
			}, function(err) {
				
				if (err) {
					locals.validationErrors = err.errors;
					return next();
				} else {
					req.flash('success', player.name.full + ' was updated successfully.');

					// redirect so we get the lastest data
					res.redirect('/players');
				}
			
			});

		});
	
	});


	// DELETE a User
	
	view.on('get', { delete: true }, function(next) {
		
		keystone.list('User').model.findById(req.query.delete).exec(function(err, player) {

			if (err) return res.err(err);
		
			player.state = 'inactive';
			player.save(function(err) {
				if (err) return res.err(err);
				req.flash('success', player.name.full + ' has been deleted.');
				return res.redirect('/players');
			});

		});
	
	});

	view.render('players');
	
};
