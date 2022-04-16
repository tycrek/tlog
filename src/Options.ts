import { Level } from './tlog';
import { DateTimeFormatOptions } from 'luxon';

export default class Options {
	/**
	 * The minimum level of log messages to output
	 */
	level: Level = 'info'

	timestamp: {
		enabled: boolean
		colour: string
		/** https://moment.github.io/luxon/#/formatting?id=presets */
		preset?: DateTimeFormatOptions
		/** https://moment.github.io/luxon/#/formatting?id=table-of-tokens */
		format?: string
	}

	label: {
		enabled: boolean
		pad: boolean
		case: 'upper' | 'lower'
		align: 'left' | 'right'
	}

	title: {
		delim: string
	}

	extra: {
		prefix: string
		suffix: string
	}

	comments: {
		char: string
		colour: string
	}

	constructor() {
		this.timestamp = {
			enabled: true,
			colour: 'white',
		};

		this.label = {
			enabled: true,
			pad: true,
			case: 'upper',
			align: 'left',
		};

		this.title = {
			delim: ': ',
		};

		this.extra = {
			prefix: '(',
			suffix: ')',
		};

		this.comments = {
			char: '//',
			colour: 'grey',
		};
	}
}
