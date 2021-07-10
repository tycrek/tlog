# tlog

[![npm image]][npm page]

My custom logger library. Uses [Chalk] for colours & [Luxon] for timestamps.

### Features

- ✔️ **No `console` wrapping:** Writes to `process.stdout` & `process.stderr`
- ✔️ **Colours, timestamps, & labels**
- ✔️ **Easily configurable:** just pass in an object with your custom settings
- ✔️ **Method chaining:** useful for attaching quick debug logs to existing logs
- ✔️ **Utility logs:** print short info snippets to aid debugging
- ✔️ **Comments:** comment your log outputs! I'm a little addicted to comments...
- ✔️ **Plugins:** easily integrate pre-built loggers with existing code

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

These are the default options:
```js
const options = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    timestamp: {
        enabled: true,
        colour: 'white',
        preset: null,
        format: null
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
```

You can include or omit as many options in the constructor as you like. Anything omitted will use the default.

### Available options

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| `level` | The minimum [log level] to print | `string` | `'debug'` or `'info'` |
| `timestamp.enabled` | Enables the timestamp. By default, the timestamp is in [ISO8601 format]. | `boolean` | `true` |
| `timestamp.colour` | Sets the [colour][available colours] of the timestamp | `string` | `'white'` |
| `timestamp.preset` | Overrides the [preset][Luxon prefix] of the timestamp | `string` | `null` |
| `timestamp.format` | Overrides the [format][Luxon format] of the timestamp. If both `preset` & `format` are set, `format` takes precedence. | `string` | `null` |
| `label.enabled` | Enables the label | `boolean` | `true` |
| `label.pad` | Pads the label to the right | `boolean` | `true` |
| `label.case` | Sets the case of the label. Must be either `upper` or `lower`. | `string` | `'upper'` |
| `title.delim` | Sets the delimiter between the title & the message | `string` | `': '` |
| `extra.prefix` | Sets the prefix for the extra data | `string` | `' ('` |
| `extra.suffix` | Sets the suffix for the extra data | `string` | `')'` |
| `comments.char` | Sets the comment character | `string` | `'//'` |
| `comments.colour` | Sets the [colour][available colours] of the comment | `string` | `'grey'` |

### Available colours

From the [Chalk Style docs]:

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray`

# API

All API methods return the logger instance, allowing for method chaining (with the exception of `.console`). Some helper functions are also provided.

## General log methods

### `logger.[level](title, message, extra)`

Prints a log at the specified level. `title` & `extra` are optional.

Levels can be one of:

- `debug`
- `info`
- `warn`
- `error`
- `success`

| Parameter | Description |
| --- | --- |
| `title` | The title of the log |
| `message` | The message of the log |
| `extra` | Any extra data to be printed with the log |

### `logger.log(...args)`

Prints the arguments, just a simple log with a timestamp. Not wrapping `console.log` so can be chained with other methods.

### `logger.err(...args)`

Prints the arguments to `stderr`, just a simple log with a timestamp. Not wrapping `console.err` so can be chained with other methods. If the last argument is an error, it will be printed as an error, with the stack trace.

## Utility logs

I wrote these utility methods to make certain things quicker to debug, depending what it is I was debugging. Especially helpful when combined with chaining.
### `logger.comment(message)`

Prints a comment-style log.

### `logger.typeof(object, title)`

Prints the type of the specified object. Title is optional, defaults to `'Typeof'`.

### `logger.epoch()`

Prints the current Unix epoch in milliseconds.

### `logger.isTTY()`

Prints if the current console is a TTY.

### `logger.windowSize()`

Prints the terminal size, in columns & rows.

### `logger.pid()`

Prints the current process ID.

### `logger.cwd()`

Prints the current working directory.

### `logger.node()`

Prints the Node.js version.

### `logger.argv()`

Prints the command line arguments.

### `logger.env()`

Prints the environment variables.

### `logger.stringify(object, title)`

Prints the JSON stringified version of the provided `object`. Title is optional, defaults to `'Stringify'`.

### `logger.uptime()`

Prints the process uptime in seconds.

## Invisible utility logs

These methods mostly write certain whitespace to `stdout`, to allow for easy debugging.

### `logger.blank()`

Prints a blank line.

### `logger.clear()`

Clears the console using Unicode escape sequences. May behave differently on different platforms.

### `logger.callback(callback, ...args)`

Calls the provided `callback` with the provided `args`. `callback` must be a function; `args` are optional.

### `logger.console`

Exposes the `console` object for convenience. This is also available staticly on the `TLog` class. Both are also available under the alias `.c` (for example: `logger.c.log('Hello, console!')`).

## Plugins

Some packages allow you to hook into the logging system. Developers can make plugins that make this easier to use. tlog comes with an [Express](http://expressjs.com/) plugin.

### `logger.enable.[plugin]()`

Enables the specified plugin. Chaining is supported.

### Express

The Express plugin lets you easily log request data. It's available as both middleware & as standalone functions.

```js
// Activate the Express plugin
const logger = new TLog({plugins: {express: true}});

// Enable the plugin
logger.enable.express()
    .debug('Express middleware enabled')
    .comment('Enabler methods are chainable too!');

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
logger.express().Host(app, 8030, '0.0.0.0'); // Also accepts host & callback parameters
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

# Colours.

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
[Chalk Style docs]: https://www.npmjs.com/package/chalk/v/1.0.0#styles
[Luxon prefix]: https://moment.github.io/luxon/#/formatting?id=presets
[Luxon format]: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
