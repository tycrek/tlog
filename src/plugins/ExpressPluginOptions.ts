/**
 * Options for the Express plugin
 */
export default class ExpressPluginOptions {
	middleware: {
		excludePaths: string[]
	}
	trim: {
		enabled: boolean
		maxLength: number
		delim: string
	}
	handle404: boolean
	handle500: boolean

	constructor() {
		this.middleware = {
			excludePaths: ['favicon.ico']
		};

		this.trim = {
			enabled: true,
			maxLength: 80,
			delim: '...',
		};

		this.handle404 = true;
		this.handle500 = true;
	}
}
