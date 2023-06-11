const { TLog } = require('..');

const log = new TLog('debug');

log.debug('Simple debug message')
	.info('Simple info message')
	.warn('Simple warn message')
	.error('Simple error message')
	.fatal('Simple fatal message')
	.success('Simple success message')
	.utils('Simple utils message');

log.debug('Debug message with a:', 'Title')
	.info('Info message with a:', 'Title')
	.warn('Warn message with a:', 'Title')
	.error('Error message with a:', 'Title')
	.fatal('Fatal message with a:', 'Title')
	.success('Success message with a:', 'Title')
	.utils('Utils message with a:', 'Title');

log.debug('Debug message with a:', 'Title', 'and extra')
	.info('Info message with a:', 'Title', 'and extra')
	.warn('Warn message with a:', 'Title', 'and extra')
	.error('Error message with a:', 'Title', 'and extra')
	.fatal('Fatal message with a:', 'Title', 'and extra')
	.success('Success message with a:', 'Title', 'and extra')
	.utils('Utils message with a:', 'Title', 'and extra');

log.comment('This is a test comment.', 'Here is another argument.')
	.basic('This is a test basic.', 'Here is another argument.')
	.blank()
	.comment('That was a blank line.');
