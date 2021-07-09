const TLog = require('../tlog');
const logger = new TLog();

logger
	.debug('This is helpful, but not necessary')
	.info('This is good information')
	.warn('Something went wrong, but it\'s ok!')
	.blank()
	.error('Uh oh!', 'This wasn\'t supposed to happen!')
	.blank()
	.comment('Then some time later, it may have worked itself out')
	.success('It worked!')
	.blank()
	.blank()
	.comment('tlog comes with a toolkit of utility logs')
	.epoch()
	.windowSize()
	.comment('And more!');
