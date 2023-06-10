import { wout, werr } from './printer';
import { Level } from './Levels';
import { TLTimestamp, TLLabel, TLTitle, TLExtra, TLComments } from './Options';
import { DateTime } from 'luxon';

export class TLog {
	private level: Level;
	private timestamp: TLTimestamp;
	private label: TLLabel;
	private title: TLTitle;
	private extra: TLExtra;
	private comments: TLComments;

	constructor(level: Level = 'info') {
		this.level = level;

		this.timestamp = {
			enabled: true,
			colour: 'grey',
			preset: DateTime.DATETIME_FULL_WITH_SECONDS
		};

		this.label = {
			enabled: true,
			pad: true,
			case: 'upper',
			align: 'left'
		};

		this.title = {
			delim: ': '
		};

		this.extra = {
			prefix: '(',
			suffix: ')'
		};

		this.comments = {
			char: '#',
			colour: 'grey'
		};

		this.debug('TLog initialized');
	}

	public debug(...args: any[]) {
		wout(...args);
	}

	public info(...args: any[]) {
		wout(...args);
	}

	public warn(...args: any[]) {
		werr(...args);
	}

	public error(...args: any[]) {
		werr(...args);
	}

	public fatal(...args: any[]) {
		werr(...args);
	}
}
