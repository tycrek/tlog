export const LOG = {
	LEVELS: {
		debug: 100,
		info: 200,
		warn: 300,
		error: 400,
		fatal: 500,

		success: 200,
		utils: 100,

		express: 200,
	},
	COLOURS: {
		debug: 'white',
		info: 'cyan',
		warn: 'yellow',
		error: 'red',
		fatal: 'red',

		success: 'green',
		utils: 'grey',

		express: 'green',
	},
	TITLES: {
		debug: '[DEBUG]',
		info: '[INFO]',
		warn: '[WARN]',
		error: '[ERROR]',
		fatal: '[FATAL]',

		success: '[SUCCESS]',
		utils: '[UTILS]',

		express: '[EXPRESS]',
	},
	SPACES: {
		debug: '   ',
		info: '    ',
		warn: '    ',
		error: '   ',
		fatal: '   ',

		success: ' ',
		utils: '   ',

		express: '  ',
	}
};
