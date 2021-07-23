<div align="center">

tlog
===

[![npm image]][npm page]

*My custom logger library, using [Chalk] for colours & [Luxon] for timestamps*
</div>

---

# Features

- 🌈 **Colours, timestamps, & labels**
- 🔧 **Easily configurable:** just pass in an object with your custom settings
- 🔗 **Method chaining:** useful for attaching quick debug logs to existing logs
- ⚙ **Utility logs:** print short info snippets to aid debugging
- 📝 **Comments:** comment your log outputs! I'm a little addicted to comments...
- 🔌 **Plugins:** easily integrate pre-built loggers with existing code
- 🚀 **No `console` wrapping:** Writes to `process.stdout` & `process.stderr`

| Code | Result |
| ---- | ------ |
| ![demo code] | ![demo result] |

# Usage

Install using `npm i @tycrek/log`, then `require` in your project:

```js
// Set up logger with default options
const TLog = require('@tycrek/log');
const logger = new TLog();

// Prints an info log
logger.info('Hello, hell!');

// Methods return the logger instance, allowing for method chaining
logger
    .warn('Wait, why are we in hell?')
    .debug('Because we\'re not using industry standard logging libs!');

// You an also specify options for a new instance
const logger2 new TLog({
    /* Options can be set here */
});
```

## Options

You can include or omit as many options in the TLog constructor as you like. Anything omitted will use the default. Options delimited by `.` will be merged into an object of the same name.

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| `level` | The minimum [log level] to print | `string` | `'debug'` or `'info'` |
| `timestamp.enabled` | Enables the timestamp. By default, the timestamp is in [ISO8601 format]. | `boolean` | `true` |
| `timestamp.colour` | Sets the [colour][available colours] of the timestamp | `string` | `'white'` |
| `timestamp.preset` | Overrides the [preset][Luxon prefix] of the timestamp | `string` | `null` |
| `timestamp.format` | Overrides the [format][Luxon format] of the timestamp. If both `preset` & `format` are set, `format` takes precedence. | `string` | `null` |
| `label.enabled` | Enables the label | `boolean` | `true` |
| `label.pad` | Pads the label to `label.align` | `boolean` | `true` |
| `label.case` | Sets the case of the label. Must be either `upper` or `lower`. | `string` | `'upper'` |
| `label.align` | Sets the alignment of the label. Must be either `left` or `right`. | `string` | `'left'` |
| `title.delim` | Sets the delimiter between the title & the message | `string` | `': '` |
| `extra.prefix` | Sets the prefix for the extra data | `string` | `' ('` |
| `extra.suffix` | Sets the suffix for the extra data | `string` | `')'` |
| `comments.char` | Sets the comment character | `string` | `'//'` |
| `comments.colour` | Sets the [colour][available colours] of the comment | `string` | `'grey'` |

### Changing options

Pass an object of options to the constructor to change any options.

<table>
<tr>
<th>Code</th>
<th>Output</th>
</tr>
<tr>
<td>

```js
// For example
const logger = new TLog({
    level: 'warn',
    timestamp: {
        enabled: false
    },
    label: {
        case: 'lower',
        align: 'right'
    }
});
```
</td>
<td>

![a](https://jmoore.dev/files/Code_M3VSYthl63.png)
</td>
</tr>
</table>

Some options also accept colours. See the [Chalk docs] for info.

# API

All API methods return the logger instance, allowing for method chaining (with the exception of `.console` & `.chalk`).

## General log methods

### `logger.[level](title, message, extra)`

Prints a log at the specified level. `title` & `extra` are optional.

<table>
<tr>
<th>Levels</th>
<th>Parameters</th>
</tr>
<tr>
<td>

| Level | Weight |
| --- | --- |
| `debug` | `100` |
| `info` | `200` |
| `warn` | `300` |
| `error` | `400` |
| `success` | `300` |
</td>
<td>

| Parameter | Description |
| --- | --- |
| `title` | The title of the log |
| `message` | The message of the log |
| `extra` | Any extra data to be printed with the log |
</td>
</tr>
</table>

### `logger.log(...args)` & `logger.err(...args)`

Prints the arguments to `stdout` & `stderr` respectively (neither wrap `console.log` nor `console.error`). `.log` is just a simple log with a timestamp; `.err` prints the last argument as an error with the stack trace (if it's an error). Both can be chained with other methods.

## Utility logs

I wrote these utility methods to make certain things quicker to debug. Especially helpful when combined with chaining.

| Method | Description |
| --- | --- |
| **`.cwd()`** | Prints the current working directory. |
| **`.pid()`** | Prints the current process ID. |
| **`.argv()`** | Prints the command line arguments. |
| **`.node()`** | Prints the Node.js version. |
| **`.epoch()`** | Prints the current Unix epoch in milliseconds. |
| **`.isTTY()`** | Prints if the current console is a TTY. |
| **`.uptime()`** | Prints the process uptime in seconds. |
| **`.windowSize()`** | Prints the terminal size, in columns & rows. |
| **`.env(key)`** | Prints the environment variables. `key` is optional. |
| **`.comment(message)`** | Prints a comment-style log. |
| **`.typeof(object, title)`** | Prints the type of the specified object. Title is optional, defaults to `'Typeof'`. |
| **`.stringify(object, title)`** | Prints the JSON stringified version of the provided `object`. Title is optional, defaults to `'Stringify'`. |
| **`.boolean(condition, title)`** | Prints the boolean evaluation of a `condition`. Title is optional, defaults to `'Boolean'`. |
| **`.true(condition, message)`** | Only prints `message` if the `condition` is true. |
| **`.false(condition, message)`** | Only prints `message` if the `condition` is false. |
| **`.ifElse(condition, msgTrue, msgFalse)`** | Prints `msgTrue` if the `condition` is true, `msgFalse` otherwise. Both are optional, defaults to `'True'` & `'False'` respectively. |
| **`.null(variable, message)`** | Prints `message` if the `variable` is `null`. `message` is optional, defaults to `'Null'` or `'Undefined'`, depending on the value of `variable`. If `variable` is not `null` or `undefined`, nothing will be printed. |

## Invisible utility logs

These methods mostly write certain whitespace to `stdout`.

| Method | Description |
| --- | --- |
| **`.blank()`** | Prints a blank line. |
| **`.clear()`** | Clears the console using Unicode escape sequences. May behave differently on different platforms. |
| **`.callback(callback, ...args)`** | Calls the provided `callback` with the provided `args`. `callback` must be a function; `args` are optional. |
| **`.console`** | Exposes the `console` object for convenience. This is also available staticly on the `TLog` class. Both are also available under the alias `.c` (for example: `logger.c.log('Hello, console!')`). |
| **`.chalk`** & **`TLog.chalk`** | In case the user wants to use [chalk][chalk], this is available as a static property on the `TLog` class or as an instance property on the `logger` instance. |

## Plugins

Plugins are optional features that you can enable & configure in one go. tlog comes with **[Process](#process)**, **[Express](#express)**, & **[Socket](#socket)** plugins.

### `logger.enable.[plugin]()`

Enables the specified plugin. Chaining is supported.

### Process

The Process plugin lets you automatically log some [events][process events] & [termination signals]:

| Events | Signals |
| --- | --- |
| `'warning'` | `'SIGINT'` |
| `'exit'` | `'SIGTERM'` |
| `'beforeExit'` | `'SIGQUIT'` |
| `'uncaughtException'` | `'SIGBREAK'` |
| `'unhandledRejection'` | `'SIGHUP'` |

- `'uncaughtException'` uses [`process.setUncaughtExceptionCaptureCallback`][process exception callback] to capture the exception
- `'unhandledRejection'` is used for uncaught `Promise` rejections
- All signals will trigger `process.exit()`
- Only the `uncaughtException` event will trigger `process.exit(1)`

You can configure the plugin by passing options to the constructor. All the events detailed above are available as booleans & the `signals` option is an array of signals to listen for. Only the signals listed above will log when passed to the constructor, any other signals will be ignored. All options are enabled by default.

```js
// Enable the Process plugin
logger.enable.process()
    .debug('Process plugin enabled')
    .comment('Enabler methods are chainable too!');
```

### Express

The Express plugin lets you easily log request data. It's available as both middleware & as standalone functions.

```js
// Enable the plugin
logger.enable.express().debug('Express middleware enabled');

// Tell Express to use the logger as middleware
app.use(logger.express(true));

// Standalone functions can be called within the route handlers
app.get('/', (req, res) => {
    logger.comment('Print the user agent')
        .express().UserAgent(req);

    logger.comment('Print Accept header')
        .express().Header(req, 'Accept');

    // Send the response
    res.send('Hello, world!');
});

// tlog can also host your Express app for you
logger.express().Host(app, 8030, '0.0.0.0'); // Also accepts a callback parameter
```

#### `logger.express(true)`

Passes the middleware to Express. Only use as a parameter to `app.use()`.

#### `logger.express().set(option, value)`

Sets an option for the Express plugin. Chaining is supported (returns the Express plugin, **not** the logger)

#### `logger.express().Host(app, port, host, callback)`

Hosts the Express app on the specified port. `app` is the Express app, `port` is the port to host the app on,`host` is the interface to listen on. If `callback` is provided, it will be called when the app is ready. Hosting your app this way automatically logs all requests, responses, & errors.

####  `logger.express().UserAgent(req)`

Prints the user agent of the request.

#### `logger.express().Header(req, header)`

Prints the value of the specified header from the request.

### Socket

The Socket plugin hosts a tiny [Node Socket server] for viewing live logs.

```js
// Enable the Socket plugin
logger.enable.socket().debug('Socket plugin enabled');
```

# 🍁 Colours.

**Colours**. I am **Canadian**. It is **colours**. If you don't like it, go **fork** yourself.

[npm image]: https://img.shields.io/npm/v/@tycrek/log?color=%23CB3837&label=View%20on%20NPM&logo=npm&style=for-the-badge
[npm page]: https://www.npmjs.com/package/@tycrek/log
[Chalk]: https://github.com/chalk/chalk
[Luxon]: https://moment.github.io/luxon
[demo code]: https://ass.rip/cRxQTzM86G4R/direct
[demo result]: https://ass.rip/L74o8uxpkKez/direct
[log level]: #loggerleveltitle-message-extra
[ISO8601 format]: https://en.wikipedia.org/wiki/ISO_8601
[available colours]: #available-colours
[Chalk docs]: https://www.npmjs.com/package/chalk/v/1.0.0#colors
[Luxon prefix]: https://moment.github.io/luxon/#/formatting?id=presets
[Luxon format]: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
[Express]: (http://expressjs.com/)
[process events]: https://nodejs.org/api/process.html#process_process_events
[process exception callback]: https://nodejs.org/api/process.html#process_process_setuncaughtexceptioncapturecallback_fn
[termination signals]: https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html
[Node Socket server]: https://nodejs.org/api/net.html#net_class_net_server
