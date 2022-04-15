import { EOL } from 'os';
import { tlog } from '..';

export const TAB_SIZE = 4;

export const CHARS: tlog.IChars = {
	EOL,
	ESCAPE: '\u001b',
	EMPTY: '',
	SPACE: ' '
};

export const DEFAULTS = new tlog.Options();
export const EXPRESS_DEFAULTS = new tlog.plugins.express.ExpressPluginOptions();
export const PROCESS_DEFAULTS = new tlog.plugins.process.ProcessPluginOptions();

export const LOG = {
	LEVELS: {
		debug: 100,
		info: 200,
		warn: 300,
		error: 400,

		success: 300,
		utils: 200,
	},
	COLOURS: {
		debug: 'white',
		info: 'cyan',
		warn: 'yellow',
		error: 'red',

		success: 'green',
		utils: 'grey',
	},
	TITLES: {
		debug: '[DEBUG]',
		info: '[INFO]',
		warn: '[WARN]',
		error: '[ERROR]',

		success: '[SUCCESS]',
		utils: '[UTILS]',
	},
	SPACES: {
		debug: '   ',
		info: '    ',
		warn: '    ',
		error: '   ',

		success: ' ',
		utils: '   ',
	}
};
