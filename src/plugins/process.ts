/**
* For the Node.js process
*/

import { TLog } from '../tlog';
import { tlog } from '../..';
import { PROCESS_DEFAULTS } from '../Constants';

const TITLE = 'PROCESS';

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
class Process implements tlog.plugins.IPlugin {
	tlog;
	options;

	/**
	 * Handles some logging for the Node.js process
	 */
	constructor(tlog: TLog, options?: tlog.plugins.process.ProcessPluginOptions) {
		this.tlog = tlog;
		this.options = options ?? PROCESS_DEFAULTS; // todo: merge with defaults
	}

	/**
	 * Starts the listeners
	 */
	listen() {
		// Before exit
		if (this.options.beforeExit)
			process.on('beforeExit', (code) =>
				this.tlog.debug(TITLE, 'exiting', `code: ${code}`));

		// Exit
		if (this.options.exit)
			process.on('exit', (code) =>
				this.tlog.debug(TITLE, `exited with code ${code}`).uptime());

		// Warnings
		if (this.options.warning)
			process.on('warning', (warning) =>
				this.tlog
					.warn(warning.name, warning.message)
					.err(warning.stack));

		// Uncaught Promise rejections
		if (this.options.unhandledRejection)
			process.on('unhandledRejection', (err: Error, promise) =>
				this.tlog
					.error('Unhandled Promise rejection', err.message, promise.toString())
					.err(err));

		// Unhandled exceptions
		if (this.options.uncaughtException)
			!process.hasUncaughtExceptionCaptureCallback()
				&& process.setUncaughtExceptionCaptureCallback((err) =>
					this.tlog
						.error('Unhandled exception', ' ')
						.err(err)
						.callback(this.exit));

		// Signals
		for (let signal of this.options.signals) {
			let s = signal.toUpperCase();
			if (Object.prototype.hasOwnProperty.call(EXIT_CODES, s))
				process.on((signal), () => this.tlog
					.debug(TITLE, `received ${signal}`, `code: ${Object(EXIT_CODES)[s]}`)
					.callback(this.exit, Object(EXIT_CODES)[s]));
		}
	}

	/**
	 * Exits the process with the specified code (code is optional, defaults to 1)
	 */
	private exit(code = 1) {
		process.exit(code);
	}
}

export default Process;
