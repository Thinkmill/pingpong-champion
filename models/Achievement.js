var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Achievement Model
 * ===========
 */

 // Ideas
 // 
 // - winning/losing streak of 5|10|20
 // - played on your birthday
 // - played for 5 days straight
 // - played 10 games in one day
 // - finished a game in under 5mins

var Achievement = new keystone.List('Achievement', {
	autokey: { path: 'key', from: 'name', unique: true },
	track: true
});

Achievement.add({
	// dateAchieved: { type: Types.Date }, // there should probably be PlayerAchievement model to join these together
	name: { type: Types.Name, required: true, index: true },
	value: { type: Number, required: true, index: true, initial: true },
	notes: { type: Types.Textarea }
});

Achievement.defaultColumns = 'name, value';

Achievement.register();
