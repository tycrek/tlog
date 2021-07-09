//#region Configs
const DEFAULTS = {
	timestamp: {
		enabled: true,
		colour: 'white',
		preset: null, // https://moment.github.io/luxon/#/formatting?id=presets
		format: null // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
	},
	label: {
		enabled: true,
		pad: true,
		case: 'upper'
	},
	title: {
		delim: ': '
	},
	extra: {
		prefix: ' (',
		suffix: ')'
	},
	comments: {
		char: '//',
		colour: 'grey'
	}
};

const T1 = {
	timestamp: {
		enabled: true,
		colour: 'red',
		preset: 'DATETIME_SHORT_WITH_SECONDS', // https://moment.github.io/luxon/#/formatting?id=presets
		format: null // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
	},
	label: {
		enabled: true,
		pad: false,
		case: 'lower'
	},
	title: {
		delim: ' -- '
	},
	extra: {
		prefix: ' {{',
		suffix: '}}'
	},
	comments: {
		char: '#',
		colour: 'blue'
	}
};

//#endregion

// Since you create a new instance of TLog, you can create multiple loggers for different contexts
const TLog = require('../tlog');
const logger = new TLog(DEFAULTS); // Options are set via object passed to constructor
// const logger = new TLog(); // Use default settings

test(new TLog(DEFAULTS));
//test(new TLog(T1));
testBasic();

function testBasic() {
	const logger = new TLog({});
	logger.info('Hello', 'This is a basic test.');
}

/**
 * @param {TLog} logger
 * @returns {void}
 */
function test(logger) {
	// 3 parameters, only 1 is required
	// Parameters are: title, message, extra
	logger.debug('Cache flushed', 'System cache has been flushed', 'operation took 0.35ms to complete');
	logger.info('Logger started', 'Ready for logs to come in!', 'they will be printed per default options');
	logger.warn('Channel closed', 'Users channel did not close in time', 'this will be handled automatically soon');
	logger.error('High system load', 'Monitor detected high system load', 'to disable these warnings, consult the docs');
	logger.success('Subscription active', 'User [Abc] has subscribed', 'onboarding email sent');

	// TLog exposes some helper methods to make logging easier
	logger.blank();
	logger.console.log('In case you\'d want to use console for whatever reason');
	TLog.console.log('It\'s also exposed staticly as TLog.console');
	logger.blank();

	// These methods are chainable (console is not chainable)
	const title = 'Experiment 3';
	const title2 = 'Experiment 4';

	logger.debug('Launching experiment...')
		.info(title, 'Starting!')
		.blank()
		.comment('Eventually, the experiment might fail. Oh yeah, ever wanted to comment your logs? Now you can!')
		.warn('Experiment failed!', 'Check experiment output file for details')
		.info(title, 'Experiment completed with failures', 'saved to output file')
		.blank()
		.comment('A different experiment may have gone a bit better')
		.info(title2, 'Starting!')
		.info(title2, 'Processing...')
		.success(title2, 'Experiment completed!', 'data saved to output file')
		.debug('No more experiments, closing...')
		.blank()
		.comment('Also would like to thank GitHub CoPilot for helping write this, and thanks GitHub for inviting me to the private beta!')
		.blank()
		.info('Typeof tests')
		.typeof(title2)
		.typeof(DEFAULTS, 'DEFAULTS')
		.typeof(new Promise((res) => res()), 'Promise')
		.typeof([1, 2, 3], 'Array')
		.typeof({ a: 1, b: 2, c: 3 }, 'Object')
		.typeof(null, 'Null')
		.typeof(undefined, 'Undefined')
		.typeof(true, 'Boolean')
		.typeof(false, 'Boolean')
		.typeof(-1, 'Number')
		.typeof(1, 'Number')
		.typeof(1.1, 'Number')
		.typeof(process.stdout)
		.comment('k that\'s prety cool')
		//.clear()
		.blank()
		.blank()
		.info('Oh you know we got utility logs!')
		.comment('Comments & blank lines:')
		.blank()
		.comment('Current Unix epoch in ms!')
		.epoch()
		.blank()
		.comment('Is the terminal a TTY?')
		.isTTY()
		.blank()
		.comment('A typeof logger, for your convenience!')
		.typeof([1, 2, 3])
		.blank()
		.comment('Check the terminal size!')
		.windowSize()
		.blank()
		.comment('The process ID')
		.pid()
		.blank()
		.comment('Current Working Directory')
		.cwd()
		.blank()
		.comment('Node.js version')
		.node()
		.blank()
		.comment('Process argv')
		.argv()
		.blank()
		.comment('Environment variables')
		//.env() // Prints all environment variables
		.env('PROCESSOR_IDENTIFIER')
		.blank()
		.success('Hell yeah, we got some utility methods!')
		.comment('Co-written by tycrek & GitHub CoPilot (including these docs & tests!')


	logger.blank().blank().blank();
}
