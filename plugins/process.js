/**
* For the Node.js process
*/

const TLog = require('../tlog');
const TITLE = 'Process';

/**
 * Default options for the Process plugin
 * @see {@link Process}
 */
const OPTIONS = {
	/**
	* Enables logging for the 'warning' event
	* @default true
	* @type {boolean}
	* @see http://nodejs.org/api/process.html#process_event_warning
	*/
	warning: true,

	/**
	 * Enables logging for the 'exit' event
	 * @default true
	 * @type {boolean}
	 * @see https://nodejs.org/api/process.html#process_event_exit
	 */
	exit: true,

	/**
	 * Enables logging for the 'beforeExit' event
	 * @default true
	 * @type {boolean}
	 * @see https://nodejs.org/api/process.html#process_event_beforeexit
	 */
	beforeExit: true,

	/**
	 * Enables logging for the 'unhandledRejection' event.
	 * This is thrown when a Promise is rejected but no handler is registered.
	 * @default true
	 * @type {boolean}
	 * @see https://nodejs.org/api/process.html#process_event_unhandledrejection
	 */
	unhandledRejection: true,

	/**
	 * Enables logging for the 'uncaughtException' event
	 * @default true
	 * @type {boolean}
	 * @see https://nodejs.org/api/process.html#process_event_uncaughtexception
	 */
	uncaughtException: true,

	/**
	 * Enables logging for the specified termination signals}
	 * @see https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html
	 * @default ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGBREAK', 'SIGHUP']
	 * @type {string[]}
	 */
	signals: ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGBREAK', 'SIGHUP']
};

/**
 * Thanks to {@link https://copilot.github.com/ GitHub CoPilot} for these values!
 * (jfc AI is freaky lol)
 * (idk if these are correct, if they're wrong, please open a PR)
 */
const EXIT_CODES = {
	'SIGINT': 128 + 2,
	'SIGTERM': 128 + 15,
	'SIGQUIT': 128 + 3,
	'SIGBREAK': 128 + 6,
	'SIGHUP': 128 + 1
};

/**
 * tlog Process plugin
 * 
 * Automatically logs certain process events & signals
 * @class
 */
class Process {
	/**
	 * @type {OPTIONS}
	 * @see {@link OPTIONS}
	 * @static
	 */
	static DEFAULT_OPTIONS = OPTIONS;

	/**
	 * @type {TLog}
	 * @private
	 */
	#tlog = null;

	/**
	 * This plugins options
	 * @type {OPTIONS}
	 * @private
	 */
	#options = {};

	/**
	 * Creates a new Process plugin, which handles some logging for the Node.js process
	 * @param {TLog} tlog The parent logger instance
	 * @param {OPTIONS} options The options to set
	 */
	constructor(tlog, options = OPTIONS) {
		this.#tlog = tlog;
		this.#options = Object.assign({}, OPTIONS, options);
	}

	/**
	 * Starts the listeners
	 */
	listen() {
		// Before exit
		if (this.#options.beforeExit)
			process.on('beforeExit', (code) =>
				this.#tlog.debug(TITLE, 'exiting', `code: ${code}`));

		// Exit
		if (this.#options.exit)
			process.on('exit', (code) =>
				this.#tlog.debug(TITLE, `exited with code ${code}`).uptime());

		// Warnings
		if (this.#options.warning)
			process.on('warning', (warning) =>
				this.#tlog
					.warn(warning.name, warning.message)
					.err(warning.stack));

		// Uncaught Promise rejections
		if (this.#options.unhandledRejection)
			process.on('unhandledRejection', (err, promise) =>
				this.#tlog
					.error('Unhandled Promise rejection', err.message || err, promise)
					.err(err));

		// Unhandled exceptions
		if (this.#options.uncaughtException)
			!process.hasUncaughtExceptionCaptureCallback()
				&& process.setUncaughtExceptionCaptureCallback((err) =>
					this.#tlog
						.error('Unhandled exception', ' ')
						.err(err)
						.callback(this.#exit));

		// Signals
		for (let signal of this.#options.signals) {
			signal = signal.toUpperCase();
			if (Object.prototype.hasOwnProperty.call(EXIT_CODES, signal))
				process.on((signal), () => this.#tlog
					.debug(TITLE, `received ${signal}`, `code: ${EXIT_CODES[signal]}`)
					.callback(this.#exit, EXIT_CODES[signal]));
		}
	}

	/**
	 * Exits the process with the specified code
	 * @param {number} [code] The code to exit with (optional, defaults to 1)
	 * @private
	 */
	#exit(code = 1) {
		process.exit(code);
	}
}

module.exports = Process;
