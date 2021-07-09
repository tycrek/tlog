# tlog

[![npm (scoped)](https://img.shields.io/npm/v/@tycrek/log?color=%23CB3837&label=View%20on%20NPM&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@tycrek/log)

My custom logger library. Uses [Chalk] for colours & [Luxon] for timestamps.

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
| `timestamp.enabled` | Enables the timestamp. By default, the timestamp is in [ISO8601 format](https://en.wikipedia.org/wiki/ISO_8601). | `boolean` | `true` |
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

### `logger.comment(message)`

Prints a comment-style log.

### `logger.typeof(object, title)`

Prints the type of the specified object. Title is optional, defaults to `'Typeof'`.

### `logger.blank()`

Prints a blank line.

### `logger.clear()`

Clears the console using Unicode escape sequences. May behave differently on different platforms.

### `logger.console`

Exposes the `console` object for convenience. This is also available staticly on the `TLog` class. Both are also available under the alias `.c` (for example: `logger.c.log('Hello, console!')`).

[Chalk]: https://github.com/chalk/chalk
[Luxon]: https://moment.github.io/luxon
[available colours]: #available-colours
[Chalk Style docs]: https://www.npmjs.com/package/chalk/v/1.0.0#styles
[Luxon prefix]: https://moment.github.io/luxon/#/formatting?id=presets
[Luxon format]: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
