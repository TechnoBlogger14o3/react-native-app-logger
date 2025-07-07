# React Native App Logger

[![npm version](https://img.shields.io/npm/v/react-native-app-logger.svg)](https://www.npmjs.com/package/react-native-app-logger)
[![npm downloads](https://img.shields.io/npm/dt/react-native-app-logger.svg)](https://www.npmjs.com/package/react-native-app-logger)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)

---

A lightweight, highly-configurable logging utility for React Native and JavaScript/TypeScript projects. Provides structured, chunked, and context-rich logs with zero dependencies.

---

## Features

- Multiple log levels: `debug`, `info`, `warn`, `error`, `none`
- Pretty JSON output for objects
- **Colorized JSON output** (opt-in, with customizable colors!)
- Auto-tagging with caller file & line number (e.g., `LoginScreen.tsx:42`)
- Enable/disable toggle
- Automatic error stack trace formatting
- Smart log splitting (avoids 4000-character truncation)
- TypeScript support with full type safety
- Zero dependencies
- Clean, consistent console output

---

## Installation

```bash
npm install react-native-app-logger
# or
yarn add react-native-app-logger
```

---

## Configuration

Configure the logger in your app's entry point (e.g., `App.tsx` or `index.tsx`):

```typescript
import { AppLogger } from 'react-native-app-logger';

AppLogger.configure({
  enabled: true, // Enable/disable all logging
  jsonFormat: true, // Pretty-print objects as JSON
  colorize: true, // Enable colorized JSON output (optional)
  keyColor: 'blue', // Color for JSON keys (optional)
  valueColor: 'magenta', // Color for JSON values (optional)
});
```

---

## Colorized JSON Output

- **Enable colorization:**
  ```typescript
  AppLogger.configure({ colorize: true, jsonFormat: true });
  ```
- **Customize colors:**
  ```typescript
  AppLogger.configure({
    colorize: true,
    keyColor: 'yellow', // or '\x1b[34m' for blue
    valueColor: 'cyan', // or '\x1b[35m' for magenta
  });
  ```
- **Supported color names:**

| Name    | Example |
|---------|---------|
| red     | `red`   |
| green   | `green` |
| yellow  | `yellow`|
| blue    | `blue`  |
| magenta | `magenta`|
| cyan    | `cyan`  |
| white   | `white` |

- **Advanced:** You can also use raw ANSI codes (e.g., `\x1b[31m` for red).
- **Note:** Hex codes like `#ebebeb` are not supported and will fall back to the default color.

---

## Usage Examples

```typescript
import { AppLogger } from 'react-native-app-logger';

AppLogger.configure({
  enabled: true,
  level: 'debug',
  jsonFormat: true,
  colorize: true,
  keyColor: 'blue',
  valueColor: 'magenta',
});

const studentObject = {
  id: 1,
  name: 'Rahul',
  marks: { math: 95, english: 88 },
  passed: true,
};

AppLogger.d('Student', studentObject);
AppLogger.e('Error', new Error('Something went wrong!'));
```

---

## Configuration Options

| Option      | Type    | Default    | Description                                 |
|-------------|---------|------------|---------------------------------------------|
| enabled     | boolean | true       | Enable/disable all logging                  |
| level       | string  | 'debug'    | Minimum log level to display                |
| jsonFormat  | boolean | true       | Pretty-print objects as JSON                |
| colorize    | boolean | false      | Enable colorized JSON output                |
| keyColor    | string  | 'red'      | Color for JSON keys (name or ANSI code)     |
| valueColor  | string  | 'green'    | Color for JSON values (name or ANSI code)   |

---

## Log Levels

| Level  | Description                | Included When Configured As        |
|--------|----------------------------|------------------------------------|
| debug  | Verbose development logs   | debug                              |
| info   | Informational messages     | info, debug                        |
| warn   | Potential issues           | warn, info, debug                  |
| error  | Runtime errors/stacktrace  | error, warn, info, debug           |
| none   | Disable all logging        |                                    |

---

## License

MIT
