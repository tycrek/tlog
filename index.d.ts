import { TLog } from './src/tlog';
import { DateTimeFormatOptions } from 'luxon';

export declare namespace tlog {
	type Level = 'debug' | 'info' | 'warn' | 'error' | 'success' | 'utils'

	interface IChars {
		static readonly EOL: string
		static readonly ESCAPE: string
		static readonly EMPTY: string
		static readonly SPACE: string
	}

	class Options {
		level: Level = 'info'
		timestamp: {
			enabled: boolean = true
			colour: string = 'white'
			/** https://moment.github.io/luxon/#/formatting?id=presets */
			preset?: DateTimeFormatOptions
			/** https://moment.github.io/luxon/#/formatting?id=table-of-tokens */
			format?: string
		}
		label: {
			enabled: boolean = true
			pad: boolean = true
			case: 'upper' | 'lower' = 'upper'
			align: 'left' | 'right' = 'left'
		}
		title: {
			delim: string = ': '
		}
		extra: {
			prefix: string = '('
			suffix: string = ')'
		}
		comments: {
			char: string = '//'
			colour: string = 'grey'
		}
	}

	declare namespace plugins {
		interface IPluginOptions { }
		interface IPlugin {
			private tlog?: TLog
			private options?: IPluginOptions
		}

		interface IPluginEnabler {
			public express(options): any
			public process(options): any
		}

		declare namespace express {
			class ExpressPluginOptions implements IPluginOptions {
				middleware: {
					excludePaths: string[] = ['favicon.ico']
				}
				trim: {
					enabled: boolean = true
					maxLength: number = 80
					delim: string = '...'
				}
				handle404: boolean = true
				handle500: boolean = true
			}
		}

		declare namespace process {
			/**
			 * @see https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html
			 */
			type Signals = 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGBREAK' | 'SIGHUP'

			class ProcessPluginOptions implements IPluginOptions {
				/**
				 * @see http://nodejs.org/api/process.html#process_event_warning
				 */
				warning: boolean = true

				/**
				 * @see https://nodejs.org/api/process.html#process_event_exit
				 */
				exit: boolean = true

				/**
				 * @see https://nodejs.org/api/process.html#process_event_beforeexit
				 */
				beforeExit: boolean = true

				/**
				 * This is thrown when a Promise is rejected but no handler is registered.
				 * @see https://nodejs.org/api/process.html#process_event_unhandledrejection
				 */
				unhandledRejection: boolean = true

				/**
				 * @see https://nodejs.org/api/process.html#process_event_uncaughtexception
				 */
				uncaughtException: boolean = true

				/**
				 * Enables logging for the specified termination signals}
				 */
				signals: Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGBREAK', 'SIGHUP']
			}
		}
	}
}
