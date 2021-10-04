const C = console;
const { DateTime } = require('luxon');
const { Stream } = require('stream');
const { mergeNoArray } = require('./deepMerge');
const chalk = require('chalk');
const { TAB_SIZE } = require('./MagicNumbers.json');

// Plugin imports
const Process = require('./plugins/process');
const { Express, OPTIONS: EXPRESS_DEFAULTS } = require('./plugins/express');
const Socket = require('./plugins/socket');

//#region // * Constants
const STD = {
	out: process.stdout,
	err: process.stderr,
};

const CHARS = {
	EOL: require('os').EOL,
	ESCAPE: '\u001b',
	EMPTY: '',
	SPACE: ' '
};

let OPTIONS = {
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	timestamp: {
		enabled: true,
		colour: 'white',
		/** https://moment.github.io/luxon/#/formatting?id=presets */
		preset: null,
		/** https://moment.github.io/luxon/#/formatting?id=table-of-tokens */
		format: null
	},
	label: {
		enabled: true,
		pad: true,
		case: 'upper', // upper, lower
		align: 'left' // left, right
	},
	title: {
		delim: ': '
	},
	extra: {
		prefix: '(',
		suffix: ')'
	},
	comments: {
		char: '//',
		colour: 'grey'
	}
};

const LOG = {
	LEVELS: {
		debug: 100,
		info: 200,
		warn: 300,
		error: 400,
		success: 300
	},
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

//#region // * Output functions
/**
 * Write to stdout
 * @param {TLog} tlog The instance of TLog calling this
 * @param {Stream} std The Stream to write to
 * @param {...*} args The objects to write
 */
function w(tlog, std, ...args) {
	std.write(args.join(CHARS.EMPTY).concat(CHARS.EOL));
	if (tlog.socket !== null)
		tlog.socket.broadcast(args.join(CHARS.EMPTY))
}

/**
 * Write to stdout
 * @param {TLog} tlog The instance of TLog calling this
 * @param {...*} args The objects to write
 */
function wout(tlog, ...args) {
	w(tlog, STD.out, ...args);
}

/**
 * Write to stderr
 * @param {TLog} tlog The instance of TLog calling this
 * @param {...*} args The objects to write
 */
function werr(tlog, ...args) {
	w(tlog, STD.err, ...args);
}
//#endregion

class TLog {
	//#region // * Static exposures
	/**
	 * Chalk, in case the user wants to use cool colours
	 * @type {chalk}
	 * @see {@link https://github.com/chalk/chalk Chalk GitHub}
	 * @see {@link https://github.com/chalk/chalk#colors Chalk colours}
	 * @see {@link chalk Chalk}
	 * @readonly
	 * @public
	 * @static
	 */
	static get chalk() { return chalk; }

	/**
	 * Chalk, in case the user wants to use cool colours.
	 * This property is also available staticly.
	 * @type {chalk}
	 * @see {@link https://github.com/chalk/chalk Chalk GitHub}
	 * @see {@link https://github.com/chalk/chalk#colors Chalk colours}
	 * @see {@link chalk Chalk}
	 * @readonly
	 * @public
	 */
	get chalk() { return chalk; }

	/**
	 * DateTime (from {@link https://moment.github.io/luxon/ Luxon}), useful for setting timestamp presets
	 * @type {DateTime}
	 * @see {@link https://moment.github.io/luxon/#/formatting?id=presets DateTime presets}
	 * @see {@link DateTime}
	 * @readonly
	 * @public
	 * @static
	 * @example
	 * const logger = new TLog({ timestamp: { preset: TLog.luxon.DATETIME_HUGE } });
	 */
	static get luxon() { return DateTime; }

	/**
	 * DateTime (from {@link https://moment.github.io/luxon/ Luxon}), useful for setting timestamp presets
	 * @type {DateTime}
	 * @see {@link https://moment.github.io/luxon/#/formatting?id=presets DateTime presets}
	 * @see {@link DateTime}
	 * @readonly
	 * @public
	 */
	get luxon() { return DateTime; }
	//#endregion

	//#region // * Console exposure
	/**
	 * Staticly exposed console, in case you wanted to use it.
	 * Can also be accessed through the alias c.
	 * @readonly
	 * @public
	 * @static
	 */
	static get console() { return C; }
	static get c() { return C; }

	/**
	 * Non-static exposed console, in case you wanted to call it from your TLog instance.
	 * Can also be accessed through the alias c.
	 * @readonly
	 * @public
	 */
	get console() { return C; }
	get c() { return C; }
	//#endregion

	/**
	 * Calls the provided callback
	 * @param {Function} callback The callback to call
	 * @param {...*} args Arguments to pass to the callback (Optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	callback(callback, ...args) {
		if (callback) callback(...args);
		return this;
	}

	//#region // * Plugins

	/**
	 * @type {Process}
	 * @see {@link Process}
	 * @private
	 */
	#process = null;

	/**
	 * @type {Express}
	 * @see {@link Express}
	 * @private
	 */
	#express = null;

	/**
	 * @type {Socket}
	 * @see {@link Socket}
	 * @public
	 */
	socket = null;

	/**
	 * Enable plugins
	 * (tycrek: I see you, I know you want to write more JSDoc, but DON'T, it doesn't need it!)
	 * @public
	 * @chainable
	 */
	enable = {
		/**
		 * Enables the {@link Process} plugin
		 * @param {Process.DEFAULT_OPTIONS} [options] The options to use (Optional)
		 * @chainable
		 * @return {TLog} This instance of TLog
		 * @see {@link Process}
		 */
		process: (options) => ((this.#process = new Process(this, options)) && this.#process.listen(), this),

		/**
		 * Enables the {@link Express} plugin
		 * @param {EXPRESS_DEFAULTS} [options] The options to use (Optional)
		 * @chainable
		 * @return {TLog} This instance of TLog
		 * @see {@link Express}
		 */
		express: (options) => ((this.#express = new Express(this, options)), this),

		/**
		 * Enables the {@link Socket} plugin
		 * @param {Socket.DEFAULT_OPTIONS} [options] The options to use (Optional)
		 * @chainable
		 * @return {TLog} This instance of TLog
		 * @see {@link Socket}
		 */
		socket: (options) => ((this.socket = new Socket(this, options)) && this.socket.listen(), this)
	};

	/**
	 * Express.js middleware
	 * @param {boolean} [middleware] Set to true if this is being passed through app.use() (Optional, defaults to false)
	 * @retun {(Express|Function)}
	 * @public
	 */
	express(middleware = false) {
		return middleware ? ((...args) => this.#express.use(...args)) : this.#express;
	}
	//#endregion

	/**
	 * The options the logger will use
	 * @type {OPTIONS}
	 * @private
	 */
	#options = {};

	/**
	 * Create a new instance of TLog
	 * @param {OPTIONS} {@link OPTIONS options} The options to use
	 */
	constructor(options = OPTIONS) {
		this.#options = mergeNoArray(OPTIONS, options);
	}

	/**
	 * Attempts to convert a value to a Boolean primitive
	 * @param {object} value The value to convert
	 * @return {boolean} The converted value
	 * @private
	 */
	#toBoolean(value) {
		return Boolean(value).valueOf();
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
					? DateTime.now().toLocaleString(DateTime[timestamp.preset] || timestamp.preset)
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
			? getPadding('right') + chalk[LOG.COLOURS[level]].inverse(LOG.TITLES[level][label.case === 'upper' ? 'toUpperCase' : 'toLowerCase']()) + getPadding('left')
			: CHARS.EMPTY;

		function getPadding(align) {
			return label.align === align && label.pad ? LOG.SPACES[level] : CHARS.EMPTY;
		}
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
		return chalk[LOG.COLOURS[level]].italic(extra ? `${CHARS.SPACE}${this.#options.extra.prefix}${extra}${this.#options.extra.suffix}` : CHARS.EMPTY);
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
		if (LOG.LEVELS[level] >= LOG.LEVELS[this.#options.level])
			(level === 'warn' || level === 'error' ? werr : wout)(this,
				`${this.#getTimestamp()}` +
				`${this.#getLabel(level)}` + CHARS.SPACE +
				`${this.#getTitle(level, title, message)}` +
				`${this.#getMessage(level, title, message)}` +
				`${(extra != null) ? this.#getExtra(level, extra) : CHARS.EMPTY}`);
		return this;
	}

	/**
	 * Prints a utility log, with colours & formatting
	 * @param {string} title The log title
	 * @param {string} data The log data
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @private
	 * @chainable
	 */
	#utilLog(title, data, extra) {
		wout(this, this.#getTimestamp(), chalk.white.bold(title).concat(data ? ': ' : CHARS.EMPTY, chalk.white(data || CHARS.EMPTY), chalk.grey(extra ? ` (${extra})` : CHARS.EMPTY)));
		return this;
	}

	/**
	 * A generic chainable log method. Acts like a console.log short-hand & with a timestamp (but using process.stdout)
	 * @param {...*} args The objects to write
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	log(...args) {
		wout(this, this.#getTimestamp(), ...args);
		return this;
	}

	/**
	 * A generic chainable error log method. Acts like a console.error short-hand (but using process.stderr).
	 * Useful for printing errors as it will show the stack trace
	 * @param {...*} args The objects to write
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	err(...args) {
		const lastArg = args[args.length - 1];
		werr(this, ...((lastArg instanceof Error) ? args.slice(0, -1).concat(lastArg.stack) : args));
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
		wout(this, chalk[this.#options.comments.colour](`${this.#options.comments.char} ${message}`));
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
		this.#utilLog(title, type);
		return this;
	}

	/**
	 * Prints the current Unix epoch in milliseconds
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://moment.github.io/luxon/api-docs/index.html#datetimetomillis}
	 */
	epoch() {
		this.#utilLog('Epoch', DateTime.now().toMillis(), 'milliseconds');
		return this;
	}

	/**
	 * Prints if the current console is a TTY
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_istty}
	 * 
	 */
	isTTY() {
		this.#utilLog('Is TTY', process.stdout.isTTY);
		return this;
	}

	/**
	 * Prints the terminal size, in columns & rows
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_columns}
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_rows}
	 */
	windowSize() {
		this.#utilLog('Window Size', `${process.stdout.columns} x ${process.stdout.rows}`, 'columns x rows');
		return this;
	}

	/**
	 * Prints the current process ID
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_pid}
	 */
	pid() {
		this.#utilLog('Process ID', process.pid);
		return this;
	}

	/**
	 * Prints the current working directory
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_cwd}
	 */
	cwd() {
		this.#utilLog('Current Working Directory', process.cwd());
		return this;
	}

	/**
	 * Prints the Node.js version
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_version}
	 */
	node() {
		this.#utilLog('Node', process.version);
		return this;
	}

	/**
	 * Prints the command line arguments
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_argv}
	 */
	argv() {
		this.#utilLog('Command line args', process.argv.slice(1));
		return this;
	}

	/**
	 * Prints the environment variables
	 * @param {string} [key] The environment variable key to print (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_env}
	 */
	env(key) {
		this.#utilLog(key === undefined ? 'Environment variables' : `env.${key}`, key === undefined ? JSON.stringify(process.env, null, TAB_SIZE) : process.env[key]);
		return this;
	}

	/**
	 * Prints a stringified object
	 * @param {object} obj The object to stringify
	 * @param {string} [title] The log title (optional, defaults to 'Stringify')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
	 */
	stringify(obj, title = 'Stringify') {
		this.#utilLog(title, JSON.stringify(obj, null, 2));
		return this;
	}

	/**
	 * Prints the process uptime
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_uptime}
	 */
	uptime() {
		this.#utilLog('Uptime', process.uptime(), 'seconds');
		return this;
	}

	/**
	 * Prints the boolean evaluation of a condition
	 * @param {*} condition The condition to evaluate
	 * @param {string} [title] The log title (optional, defaults to 'Boolean')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/valueOf}
	 */
	boolean(condition, title = 'Boolean') {
		this.#utilLog(title, this.#toBoolean(condition));
		return this;
	}

	/**
	 * Prints the message only if the condition is boolean-true.
	 * @param {boolean} condition The condition to test
	 * @param {string} message The message to print
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	true(condition, message) {
		if (this.#toBoolean(condition))
			this.#utilLog('True', message);
		return this;
	}

	/**
	 * Prints the message only if the condition is boolean-false.
	 * @param {boolean} condition The condition to test
	 * @param {string} message The message to print
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	false(condition, message) {
		if (!this.#toBoolean(condition))
			this.#utilLog('False', message);
		return this;
	}

	/**
	 * Prints one of two messages based on the condition
	 * @param {boolean} condition The condition to test
	 * @param {string} [messageIfTrue] The message to print if the condition is true (optional, defaults to 'True')
	 * @param {string} [messageIfFalse] The message to print if the condition is false (optional, defaults to 'False')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	ifElse(condition, messageIfTrue = 'True', messageIfFalse = 'False') {
		if (this.#toBoolean(condition)) this.#utilLog('IfElse', messageIfTrue);
		else this.#utilLog('IfElse', messageIfFalse);
		return this;
	}

	/**
	 * Prints if the variable is null or undefined. If it is not, nothing will print.
	 * @param {*} variable The variable to test
	 * @param {string} [message] The message to print (optional, defaults to 'Null' or 'Undefined')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined}
	 */
	null(variable, message) {
		this.#utilLog(variable === null ? 'Null' : variable === undefined ? 'Undefined' : 'NotNull', message || '');
		return this;
	}

	/**
	 * Prints a blank line
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	blank() {
		wout(this);
		return this;
	}

	/**
	 * Clears the console
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	clear() {
		wout(this, `${CHARS.ESCAPE}[2J${CHARS.ESCAPE}[H`);
		return this;
	}
}

module.exports = TLog;
