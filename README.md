# React Native App Logger

[![npm version](https://img.shields.io/npm/v/react-native-app-logger.svg)](https://www.npmjs.com/package/react-native-app-logger)
[![npm downloads](https://img.shields.io/npm/dt/react-native-app-logger.svg)](https://www.npmjs.com/package/react-native-app-logger)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)

A lightweight, configurable logging utility for React Native applications. Written in TypeScript with zero dependencies.

## Features

- Multiple log levels (`debug`, `info`, `warn`, `error`, `none`)
- Simple enable/disable toggle
- Automatic error stack trace formatting
- Smart log splitting (avoids 4000-character truncation)
- TypeScript support with full type safety
- Zero dependencies
- Clean console output

## Installation

```bash
npm install react-native-app-logger
# or
yarn add react-native-app-logger
```

## Configuration
Configure the logger in your app's entry point (typically App.tsx or index.tsx):
```
import { AppLogger } from 'react-native-app-logger';

AppLogger.configure({
  enabled: true, // Set to false to disable all logging
  level: __DEV__ ? 'debug' : 'warn', // Use your environment logic
});
```
## Configuration Options

| Option  | Type | Default | Description |
| ------------- | ------------- |------------- | ------------- |
| enabled  | boolean  |  true  | Enable/disable all logging |
| level  | string  |  'debug'  | Minimum log level to display |

## Usage
```
// Basic logging
AppLogger.debug('Component', 'Rendering started');
AppLogger.info('Network', 'API request sent');

// Warning with context
AppLogger.warn('Storage', 'Low disk space', { freeSpace: '150MB' });

// Error handling
AppLogger.error('Auth', new Error('Login failed'));

// Long messages
AppLogger.debug('Data', largeJsonString);
```

## Log Levels


| Level  | Description | Included When Configured As |
| ------------- | ------------- | ------------- |
| debug  | Verbose development logs  |  debug |
| info  | Informational messages  |  info, debug |
| warn  | Potential issues  |  warn, info, debug |
| error  | Runtime errors with stack traces  |  error, warn, info, debug |
| none  | Disable all logging  |   |
