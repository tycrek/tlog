const { DateTime } = require('luxon');
const chalk = require('chalk');
const AvailableColours = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];

const C = console;

//#region Constants
const CHARS = {
	EMPTY: '',
	SPACE: ' '
};

let OPTIONS = {
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

const LOG = {
	COLOURS: {
		debug: 'white',
		info: 'cyan',
		warn: 'yellow',
		error: 'red',
		success: 'green',
	},
	TITLES: {
		debug: '[DEBUG]',
		info: '[INFO]',
		warn: '[WARN]',
		error: '[ERROR]',
		success: '[SUCCESS]',
	},
	SPACES: {
		debug: '   ',
		info: '    ',
		warn: '    ',
		error: '   ',
		success: ' ',
	}
};
//#endregion

class TLog {
	/**
	 * The colours users can set
	 * @see {@link AvailableColours}
	 * @readonly
	 * @public
	 * @static
	 */
	static AvailableColours = AvailableColours;

	/**
	 * Staticly exposed console, in case you wanted to use it
	 * @readonly
	 * @public
	 * @static
	 */
	static console = C;
	static c = C;

	/**
	 * Non-static exposed console, in case you wanted to call it from your TLog instance
	 * @readonly
	 * @public
	 */
	console = C;
	c = C;

	/**
	 * The options the logger will use
	 * @type {object}
	 * @private
	 */
	#options = {};

	/**
	 * Create a new instance of TLog
	 * @param {object} {@link OPTIONS options} The options to use
	 */
	constructor(options = OPTIONS) {
		this.#options = Object.assign({}, OPTIONS, options);
	}

	/**
	 * Generate a log-ready timestamp
	 * @return {string} A timestamp, with colours & formatting (if enabled)
	 * @private
	 */
	#getTimestamp() {
		const timestamp = this.#options.timestamp;
		return timestamp.enabled
			? chalk[timestamp.colour](timestamp.format
				? DateTime.now().toFormat(timestamp.format)
				: timestamp.preset
					? DateTime.now().toLocaleString(DateTime[timestamp.preset])
					: DateTime.now().toISO())
				.concat(CHARS.SPACE)
			: CHARS.EMPTY;
	}

	/**
	 * Generate a log-ready label
	 * @param {string} level The log level
	 * @return {string} A label, with colours & formatting (if enabled)
	 * @private
	 */
	#getLabel(level) {
		const label = this.#options.label;
		return label.enabled
			? chalk[LOG.COLOURS[level]].inverse(LOG.TITLES[level][label.case === 'upper' ? 'toUpperCase' : 'toLowerCase']()) + (label.pad ? LOG.SPACES[level] : CHARS.SPACE)
			: CHARS.EMPTY;
	}

	/**
	 * Generate a log-ready title
	 * @param {string} level The log level
	 * @param {string} title The log title
	 * @param {string} message The log message
	 * @return {string} A title, with colours & formatting (if set)
	 * @private
	 */
	#getTitle(level, title, message) {
		return chalk[LOG.COLOURS[level]].bold(message ? `${title}${this.#options.title.delim}` : CHARS.EMPTY);
	}

	/**
	 * Generate a log-ready message
	 * @param {string} level The log level
	 * @param {string} title The log title
	 * @param {string} message The log message
	 * @return {string} A message, with colours & formatting
	 * @private
	 */
	#getMessage(level, title, message) {
		return chalk[LOG.COLOURS[level]](message || title);
	}

	/**
	 * Generate a log-ready extra
	 * @param {string} level The log level
	 * @param {string} extra The log extra
	 * @return {string} An extra, with colours & formatting (if set)
	 * @private
	 */
	#getExtra(level, extra) {
		return chalk[LOG.COLOURS[level]].italic(extra ? `${this.#options.extra.prefix}${extra}${this.#options.extra.suffix}` : CHARS.EMPTY);
	}

	/**
	 * Prints a formatted log message
	 * @param {string} level The log level
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @private
	 * @chainable
	 */
	#log(level, title, message, extra) {
		C.log(
			this.#getTimestamp() +
			this.#getLabel(level) +
			this.#getTitle(level, title, message) +
			this.#getMessage(level, title, message) +
			this.#getExtra(level, extra));
		return this;
	}

	/**
	 * Prints a formatted debug log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	debug(title, message, extra) {
		return this.#log('debug', title, message, extra);
	}

	/**
	 * Prints a formatted info log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	info(title, message, extra) {
		return this.#log('info', title, message, extra);
	}

	/**
	 * Prints a formatted warn log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	warn(title, message, extra) {
		return this.#log('warn', title, message, extra);
	}

	/**
	 * Prints a formatted error log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	error(title, message, extra) {
		return this.#log('error', title, message, extra);
	}

	/**
	 * Prints a formatted success log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	success(title, message, extra) { return this.#log('success', title, message, extra); }

	/**
	 * Prints a formatted comment log message
	 * @param {string} message The log message
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	comment(message) {
		C.log(chalk[this.#options.comments.colour](`${this.#options.comments.char} ${message}`));
		return this;
	}

	/**
	 * Prints a blank line
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	blank() {
		C.log('');
		return this;
	}

	/**
	 * Prints the type of an object
	 * @param {object} obj The object to print the type of
	 * @param {string} [title] The log title (optional, defaults to 'Typeof')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	typeof(obj, title = 'Typeof') {
		const type = (Object.prototype.toString.call(obj).match(/(?<= )(.*?)(?=\])/gi) || ['Unknown'])[0];
		C.log(chalk.white.bold(title).concat(': ', CHARS.SPACE, chalk.grey(type)));
		return this;
	}
}

module.exports = TLog;
