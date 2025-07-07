type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  enabled: boolean;
  jsonFormat?: boolean;
  colorize?: boolean;
  keyColor?: string;
  valueColor?: string;
}

const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  jsonFormat: true,
  colorize: false,
  keyColor: '\x1b[31m',
  valueColor: '\x1b[32m',
};

let loggerConfig: LoggerConfig = { ...DEFAULT_CONFIG };

function stringifyMessage(msg: any): string {
  if (msg instanceof Error) {
    return `${msg.name}: ${msg.message}\n${msg.stack}`;
  }

  if (typeof msg === 'object') {
    try {
      return loggerConfig.jsonFormat
        ? colorizeJson(msg)
        : JSON.stringify(msg);
    } catch {
      return String(msg);
    }
  }

  return String(msg);
}

function colorizeJson(obj: any): string {
  const keyColor = getAnsiColor(loggerConfig.keyColor, '\x1b[31m');
  const valueColor = getAnsiColor(loggerConfig.valueColor, '\x1b[32m');
  const reset = '\x1b[0m';
  const json = JSON.stringify(obj, null, 2);
  return json.replace(
    /\"(.*?)\":/g,
    `${keyColor}"$1"${reset}:`
  ).replace(
    /: (\".*?\"|\\d+|true|false|null)/g,
    `: ${valueColor}$1${reset}`
  );
}

function getCaller(): string {
  const stack = new Error().stack?.split('\n');
  if (!stack || stack.length < 4) return '';

  const stackLine = stack[3];
  // Try to extract function name, file, and line
  const match = stackLine.match(/at (.+?) \\((.*):(\\d+):(\\d+)\\)/) || stackLine.match(/at (.*):(\\d+):(\\d+)/);
  if (match) {
    if (match.length === 5) {
      // With function name
      const [, funcName, filePath, lineNum] = match;
      const fileName = filePath.split('/').pop();
      return `${funcName} (${fileName}:${lineNum})`;
    } else if (match.length === 4) {
      // Without function name
      const [, filePath, lineNum] = match;
      const fileName = filePath.split('/').pop();
      return `(${fileName}:${lineNum})`;
    }
  }
  return '';
}

function logFormatted(level: LogLevel, tagOrMsg: any, maybeMsg?: any): void {
  const tag = maybeMsg !== undefined ? tagOrMsg : 'Log';
  const msg = maybeMsg !== undefined ? maybeMsg : tagOrMsg;
  const stringified = stringifyMessage(msg);
  const caller = getCaller();

  // Print the entire log in one go, no chunking
  console.log(`${caller} :==> ${tag}, ${stringified}`);
}

function getAnsiColor(color?: string, fallback: string = '\x1b[0m'): string {
  const colorMap: Record<string, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };
  if (!color) return fallback;
  if (color.startsWith('\x1b[')) return color; // raw ANSI
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
    // Optionally: console.warn('Hex colors are not supported in terminal logs.');
    return fallback;
  }
  return colorMap[color.toLowerCase()] || fallback;
}

export class AppLogger {
  static configure(config: Partial<LoggerConfig>) {
    loggerConfig = { ...loggerConfig, ...config };
  }

  static d(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled) return;
    logFormatted('debug', tagOrMsg, maybeMsg);
  }

  static i(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled) return;
    logFormatted('info', tagOrMsg, maybeMsg);
  }

  static w(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled) return;
    logFormatted('warn', tagOrMsg, maybeMsg);
  }

  static e(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled) return;
    logFormatted('error', tagOrMsg, maybeMsg);
  }
}
