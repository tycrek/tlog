const { DateTime } = require('luxon');
const chalk = require('chalk');

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
	static console = console;
	console = console;

	#options = {};
	constructor(options = OPTIONS) {
		this.#options = Object.assign({}, OPTIONS, options);
	}

	debug(title, message, extra) { return this.#log('debug', title, message, extra); }
	info(title, message, extra) { return this.#log('info', title, message, extra); }
	warn(title, message, extra) { return this.#log('warn', title, message, extra); }
	error(title, message, extra) { return this.#log('error', title, message, extra); }
	success(title, message, extra) { return this.#log('success', title, message, extra); }
	comment(message) { console.log(chalk.grey(`${this.#options.comments} ${message}`)); return this; }
	blank() { console.log(''); return this; }

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

	#getLabel(level) {
		const label = this.#options.label;
		return label.enabled
			? chalk[LOG.COLOURS[level]].inverse(LOG.TITLES[level][label.case === 'upper' ? 'toUpperCase' : 'toLowerCase']()) + (label.pad ? LOG.SPACES[level] : CHARS.SPACE)
			: CHARS.EMPTY;
	}

	#getTitle(level, title, message) {
		return chalk[LOG.COLOURS[level]].bold(message ? `${title}${this.#options.title.delim}` : CHARS.EMPTY);
	}

	#getMessage(level, title, message) {
		return chalk[LOG.COLOURS[level]](message || title);
	}

	#getExtra(level, extra) {
		return chalk[LOG.COLOURS[level]].italic(extra ? `${this.#options.extra.prefix}${extra}${this.#options.extra.suffix}` : CHARS.EMPTY);
	}

	#log(level, title, message, extra) {
		console.log(
			this.#getTimestamp() +
			this.#getLabel(level) +
			this.#getTitle(level, title, message) +
			this.#getMessage(level, title, message) +
			this.#getExtra(level, extra));
		return this;
	}
}

module.exports = TLog;
