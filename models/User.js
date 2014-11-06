var keystone = require('keystone'),
	moment = require('moment'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
	autokey: { path: 'key', from: 'name', unique: true },
	track: true
});

var deps = {
	github: { 'services.github.isConfigured': true },
	facebook: { 'services.facebook.isConfigured': true },
	google: { 'services.google.isConfigured': true },
	twitter: { 'services.twitter.isConfigured': true }
}

User.add({
	state: { type: Types.Select, options: 'active, inactive', default: 'active' },
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	password: { type: Types.Password, initial: true },
	dob: { type: Types.Date, label: 'Date of Birth' },
	isAdmin: { type: Boolean },
}, 'Profile', {
	photo: { type: Types.CloudinaryImage }, // TODO: configure cloudinary (currently useing Keystone demo account)
	achievements: { type: Types.Relationship, ref: 'Achievement', many: true },
	bio: { type: Types.Markdown }
}, 'Dimensions', {
	gender: { type: Types.Select, options: 'male, female' },
	age: { type: Number, noedit: true },
	handicap: { type: Number, noedit: true }, // based on score
}, 'Stats', {
	points: { type: Number, default: 0 }, // +8 for a win + point difference at the end of the game
	score: { type: Number, default: 0 }, // win/loss percentage 
	rank: { type: Number, default: 0 }, // 1 to {number of players}
	totalGames: { type: Number, default: 0, label: 'Games played' },
	totalWins: { type: Number, default: 0, label: 'Wins' },
	totalLosses: { type: Number, default: 0, label: 'Losses' },
	totalPointsWon: { type: Number, default: 0, label: 'Points won' },
	totalPointsLost: { type: Number, default: 0, label: 'Points lost' },
	totalTimePlayed: { type: Number, default: 0 }, // stored in seconds
	longestWinningStreak: { type: Number, default: 0 },
	longestLosingStreak: { type: Number, default: 0 },
	mostPlayedOpponent: { type: Types.Relationship, ref: 'User' },
	leastPlayedOpponent: { type: Types.Relationship, ref: 'User' }
	
});


// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});




// Pre Save
// ------------------------------

User.schema.pre('save', function(next) {
	
	var user = this;

	if (!user.dob) return next();

	user.age = moment().diff(user.dob, 'years');

	next();
});


/**
 * Registration
 */

User.defaultColumns = 'name, points, totalGames, totalWins, totalLosses, totalPointsWon, totalPointsLost';
User.register();
