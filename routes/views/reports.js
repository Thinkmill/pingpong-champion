var keystone = require('keystone'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'reports';
	locals.moment = moment;

	locals.current.metric =  req.query.metric || 'singles';
	locals.current.dimension =  req.query.dimension || 'players';
	locals.current.fixedDateRange = req.query.fixedDateRange ? req.query.fixedDateRange.replace(/\+/g, ' ') : undefined;

	locals.relativeDates = {
		startOfToday:      moment().startOf('day').format('YYYY-MM-DD'),
		endOfToday:        moment().endOf('day').format('YYYY-MM-DD'),
		startOfYesterday:  moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD'),
		endOfYesterday:    moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD'),
		
		oneWeekAgo:        moment().startOf('day').subtract(1, 'weeks').format('YYYY-MM-DD'),
		oneMonthAgo:       moment().startOf('day').subtract(1, 'months').format('YYYY-MM-DD'),
		threeMonthsAgo:    moment().startOf('day').subtract(3, 'months').format('YYYY-MM-DD'),
		sixMonthsAgo:      moment().startOf('day').subtract(6, 'months').format('YYYY-MM-DD'),
		twelveMonthsAgo:   moment().startOf('day').subtract(12, 'months').format('YYYY-MM-DD')
	};

	locals.current.reportAfter = req.query.reportAfter || moment().subtract(1, 'months').format('YYYY-MM-DD');
	locals.current.reportBefore = req.query.reportBefore || moment().format('YYYY-MM-DD');
	
	locals.current.customDateRange = (req.query.reportBefore || req.query.reportAfter) ? true : false;

	// set page title
	locals.headerbarLabel = keystone.utils.upcase(locals.current.metric) + ' games between ' + moment(locals.current.reportAfter).format('D MMM YYYY') + ' and ' + moment(locals.current.reportBefore).format('D MMM YYYY') + ' - comparing ' + keystone.utils.upcase(locals.current.dimension);

	view.render('reports');
	
};
