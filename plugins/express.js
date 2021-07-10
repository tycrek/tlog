/**
* For Express.js (visit {@link http://expressjs.com})
*/

const TLog = require('../tlog');
const chalk = require('chalk');

const TITLE = 'Express';
const LABEL = chalk.green.inverse(`[${TITLE}]`);
const OPTIONS = {};

class Express {
	/**
	 * @type {TLog}
	 * @private
	 */
	#tlog = null;

	/**
	 * This plugins options
	 * @type {object}
	 * @private
	 */
	#options = {};

	/**
	 * Creates a new Express.js logging middleware plugin
	 * @param {TLog} tlog The parent logger instance
	 */
	constructor(tlog) {
		this.#tlog = tlog;
		this.#options = Object.assign({}, OPTIONS);
	}

	/**
	 * Uses Chalk to build a log-ready String
	 * @param {string} [title] The title of the log (Optional)
	 * @param {string} message The message of the log
	 * @param {string} [extra] The extra data for the log (Optional)
	 * @returns {string} The log-ready String
	 * @private
	 */
	#buildExpressLog(title, message, extra) {
		return `${LABEL} ${message ? chalk.green.bold(title.concat(': ')) : ''}${message || ''} ${extra ? chalk.italic(`(${extra})`) : ''}`;
	}

	/**
	 * Hosts the provided Express app on the specified port
	 * @param {*} app The Express app
	 * @param {number} port The port to host the Express app on
	 * @param {string} host The host to host the Express app on (example: '0.0.0.0')
	 * @param {function} [callback] The callback to invoke when the Express app is hosted (Optional)
	 * @public
	 */
	Host(app, port, host, callback = null) {
		app.use((req, res, _next) => this.#tlog.warn(this.#buildExpressLog('Not found', req.url)).callback(() => res.sendStatus(404)));
		app.use((err, _req, res, _next) => this.#tlog.error(this.#buildExpressLog('Response error', err)).callback(() => res.sendStatus(500)));
		app.listen(port, host, () =>
			this.#tlog.log(this.#buildExpressLog(
				'Express started',
				`Listening on ${host}:${port}`,
				`click http://127.0.0.1:${port}/`))
				.callback(callback));
		// todo: add methods for 4xx, 5xx, etc. (right now both this and test.js output logs)
	}

	/**
	 * Logs the request URL for every request of an Express app
	 * @param {object} req The Express request
	 * @param {object} res The Express response
	 * @param {function} next The Express next middleware
	 * @public
	 */
	use(req, res, next) {
		this.#tlog.log(this.#buildExpressLog(`HTTP ${req.method}`, req.url));
		res.on('finish', () => this.#tlog.log(this.#buildExpressLog('Response', res.statusCode)));
		next();
	}

	/**
	 * Sets an option for this Express plugin
	 * @param {string} option The option to change
	 * @param {*} value The value to set the option to
	 * @return {Express} For chaining Express plugin methods after setting an option, or for setting more options
	 * @public
	 */
	set(option, value) {
		this.#options[option] = value;
		return this;
	}

	/**
	 * Logs the User Agent of the request
	 * @param {object} req The Express request
	 * @public
	 */
	UserAgent(req) {
		this.#tlog.log(this.#buildExpressLog('User-Agent', req.headers['user-agent']));
	}

	/**
	 * Logs a specific header of the request.
	 * @param {object} req The Express request
	 * @param {string} [header] The header to log (Optional, defaults to 'user-agent')
	 * @public
	 */
	Header(req, header = 'user-agent') {
		this.#tlog.log(this.#buildExpressLog(`Header ${header}`, req.header(header)));
	}
}

module.exports = Express;