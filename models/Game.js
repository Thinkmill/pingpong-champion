var _ = require('underscore'),
	keystone = require('keystone'),
	async = require('async'),
	Types = keystone.Field.Types;

/**
 * Game Model
 * ===========
 */

var Game = new keystone.List('Game', {
	track: true
});

Game.add({
	name: { type: String },
	type: { type: Types.Select, options: 'singles, doubles', default: 'singles' },
	winningPlayer: { type: Types.Relationship, ref: 'User' }, // winning players receive 10 points + 1 point for each point discrepancy at the end of the game
	losingPlayer: { type: Types.Relationship, ref: 'User' },
	winningScore: { type: Number },
	losingScore: { type: Number }
}, 'Meta', {
	player1: { type: Types.Relationship, ref: 'User' },
	player2: { type: Types.Relationship, ref: 'User' },
	player1Score: { type: Number },
	player2Score: { type: Number },
	notes: { type: Types.Textarea }
	
});




// Pre Save
// ------------------------------

Game.schema.pre('save', function(next) {
	
	var game = this;

	// set the win/lose fields
	if (game.player1Score === game.player2Score) {

		console.error('A draw was logged, no players have been updated.')
		return next();

	} else if (game.player1Score > game.player2Score) {

		game.winningPlayer = game.player1;
		game.losingPlayer = game.player2;
		
		game.winningScore = game.player1Score;
		game.losingScore = game.player2Score;

	} if (game.player2Score > game.player1Score) {

		game.winningPlayer = game.player2;
		game.losingPlayer = game.player1;
		
		game.winningScore = game.player2Score;
		game.losingScore = game.player1Score;

	};

	// set the name
	game.name = game.winningScore + ' vs ' + game.losingScore;

	next();
});




// Post Save
// ------------------------------

Game.schema.post('save', function() {
	
	var game = this;
	var scoreDiscrepancy = (game.winningScore - game.losingScore);
	
	// update winner data
	var updateWinner = function(done) {
		keystone.list('User').model.findById(game.winningPlayer).exec(function(err, winner) {
			if (err || !winner) return done(err);

			winner.points = (winner.points + 8 + scoreDiscrepancy);
			winner.totalGames = winner.totalGames + 1;
			winner.totalWins = winner.totalWins + 1;
			winner.totalPointsWon = scoreDiscrepancy;

			winner.save(done);
		});
	};
	
	// update loser data
	var updateLoser = function(done) {
		keystone.list('User').model.findById(game.losingPlayer).exec(function(err, loser) {
			if (err || !loser) return done(err);

			loser.totalGames = loser.totalGames + 1;
			loser.totalLosses = loser.totalLosses + 1;
			loser.totalPointsLost = scoreDiscrepancy;

			loser.save(done);
		});
	};
	
	// update ranking
	var resetRankings = function() {
		keystone.list('User').model.find({ 'state': 'active' }).sort('-points').exec(function(err, players) {
			
			if (err || !players) return;

			_.each(players, function(player, i) {
				player.rank = i+1;
				player.save();
			});

		});
	};
	
	async.parallel([updateWinner, updateLoser], resetRankings);

});

Game.defaultColumns = 'winningPlayer, winningScore, losingPlayer, losingScore';

Game.register();
