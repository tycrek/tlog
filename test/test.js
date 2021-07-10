//#region Configs
const DEFAULTS = {
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
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
	level: 'warn',
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
//const logger = new TLog(DEFAULTS); // Options are set via object passed to constructor
//const logger = new TLog(); // Use default settings

testBasic();
test(new TLog(DEFAULTS));
//test(new TLog(T1));
//testExpress();
testExpress2();

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

function testExpress() {
	// Shorthand for creating a new Express app
	const app = require('express')();

	// Create the logger
	const logger = new TLog({ plugins: { express: true } });

	// Enable the Express plugin
	logger.enable.express().debug('Express logs active');

	// Tell Express to use the middleware
	// (this is optional, but it's a good idea to use it)
	app.use(logger.express(true));

	// Use TLog Express helper functions in your route handlers
	app.get('/', (req, res) => {
		logger.express().UserAgent(req);
		logger.express().Header(req, 'Accept');
		res.send(`Welcome to: ${req.url}`);
	});

	// TLog can also host your Express app for you
	logger.express().Host(app, 10491, '0.0.0.0', () => logger.log('That\'s epic!'));
}

function testExpress2() {
	// Activate the Express plugin
	const logger = new TLog({ plugins: { process: true, express: true } });

	// Enable the plugin
	logger.enable.process().debug('Process logger enabled');
	logger.enable.express().debug('Express middleware enabled');

	const app = require('express')();

	// Tell Express to use the logger as middleware
	app.use(logger.express(true));

	// Standalone functions can be called within the route handlers
	app.get('/', (req, res) => res.redirect('/redir'));
	app.get('/redir', (req, res) => res.send('You made it'));
	app.get('/client', (req, res) => res.status(404).send('Not Found'));
	app.get('/error', (req, res) => res.status(500).send('Internal Server Error'));
	app.get('/continue', (req, res) => res.status(100).send('Continue'));
	app.get('/fail', (req, res) => res.send('This variable does not exist: ' + haha));
	app.get('/pfail', (req, res) => new Promise((resolve, reject) => reject(new Error('Failed to complete request!'))));

	// tlog can also host your Express app for you
	logger.express().Host(app, 8030, '0.0.0.0'); // Also accepts host & callback parameters
}
