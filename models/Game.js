var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Game Model
 * ===========
 */

var Game = new keystone.List('Game', {
	track: true
});

Game.add({
	type: { type: Types.Select, options: 'singles, doubles' },
	player1: { type: Types.Relationship, ref: 'User' },
	player2: { type: Types.Relationship, ref: 'User' },
	winningPlayer: { type: Types.Relationship, ref: 'User' },// winning players receive 10 points + 1 point for each point discrepancy at the end of the game
	losingPlayer: { type: Types.Relationship, ref: 'User' },
	startTime: { type: Types.Datetime },
	endTime: { type: Types.Datetime }
}, 'Meta', {
	duration: { type: Number }, // stored in seconds
	team1Score: { type: Number },
	team2Score: { type: Number },
	notes: { type: Types.Textarea }
	
});

Game.defaultColumns = 'player1, team1Score, player2, team2Score';

Game.register();
