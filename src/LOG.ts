/**
 * Constants to be used for level-specific logging.
 */
export const LOG = {

	/**
	 * Numeric severity levels
	 */
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

	/**
	 * Colours for each level
	 */
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

	/**
	 * Label titles for each level
	 */
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

	/**
	 * Spaces to be used for padding each level
	 */
	SPACES: {
		debug: '   ',
		info: '    ',
		warn: '    ',
		error: '   ',
		fatal: '   ',

		success: ' ',
		utils: '   ',

		express: ' ',
	}
};
