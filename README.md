[//]: # (NPM centered badge template START --------------------------------------------------)

<div align="center">

tlog
===

[![NPMCBT badge]][NPMCBT link]

*My custom logger library*
</div>

[NPMCBT badge]: https://img.shields.io/npm/v/@tycrek/log?color=CB3837&label=%20View%20on%20NPM&logo=npm&style=for-the-badge
[NPMCBT link]: https://www.npmjs.com/package/@tycrek/log

[//]: # (NPM centered badge template END ----------------------------------------------------)

# Features

- 🌈 **Colours, timestamps, & labels**
- 🔧 **Easily configurable**
- 🔗 **Method chaining**
- ⚙ **Utility logs**
- 📝 **Comments**
- 🔌 **Express.js middleware**
- 🚀 **No `console` wrapping**

# Installation

Install using **`npm i @tycrek/log`**, then load it into your project:

```js
// Import TLog
import { TLog } from '@tycrek/log';
// or
const TLog = require('@tycrek/log');

// Set up a new instance
const logger = new TLog();

// or, set a level
const logger = new TLog('info');
```

Prints an info log:

```js
logger.info('Hello, hell!');
```

Methods return the logger instance, allowing for method chaining:

```js
logger
    .warn('Wait, why are we in hell?')
    .debug('Because we\'re not using industry standard logging libs!');
```

You can configure TLog options with the following methods:

| Method | Description |
| --- | --- |
| **`.setLevel(level)`** | Sets the minimum log level to print. |
| **`.setTimestamp({})`** | Enables or disables the timestamp, or configures **colour**, **preset**, & **format**. |
| **`.setLabel({})`** | Enables or disables the label, or configures **padding**, **case**, & **alignment**. |
| **`.setTitle({})`** | Sets the title **delimiter**. |
| **`.setExtra({})`** | Sets the extra **prefix** & **suffix**. |
| **`.setComments({})`** | Sets the comment **character** & **colour**. |

## General log methods

### `logger.[level](title, message?, extra?)`

Prints a log with the specified level. The `title` is printed in bold & colour, followed by the `message` in normal text. If `extra` is provided, it is printed in italics after the message.

You may pass **1**, **2**, or **3** parameters to these methods (message; title & message; title, message, & extra).

Possible levels are:

| Level | Severity |
| --- | --- |
| **`debug`** | `100` |
| **`info`** | `200` |
| **`warn`** | `300` |
| **`error`** | `400` |
| **`fatal`** | `500` |

Additional log levels are available for your convenience:

| Level | Severity |
| --- | --- |
| **`utils`** | `100` |
| **`success`** | `200` |
| **`express`** | `200` |

## Utility logs

| Method | Description |
| --- | --- |
| **`.pid()`** | Prints the current process ID. |
| **`.cwd()`** | Prints the current working directory. |
| **`.epoch()`** | Prints the current Unix epoch in milliseconds. |
| **`.uptime()`** | Prints the process uptime in seconds. |
| **`.comment(message)`** | Prints a comment-like log. Useful for demoing outputs. |
| **`.basic(message)`** | Prints a basic log with a timestamp (if enabled). |

## Invisible utility logs

| Method | Description |
| --- | --- |
| **`.blank()`** | Prints a blank line. |
| **`.clear()`** | Clears the console using Unicode escape sequences. May behave differently on different platforms. |
| **`.callback(cb)`** | Calls the provided `cb` function. |

# 🍁 Colours.

**Colours**. I am **Canadian**. It is **colours**. If you don't like it, go **fork** yourself.
