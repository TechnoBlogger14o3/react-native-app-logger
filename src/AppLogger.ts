type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  jsonFormat?: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  level: 'debug',
  jsonFormat: true,
};

const PRIORITY: Record<LogLevel, number> = {
  none: 5,
  error: 4,
  warn: 3,
  info: 2,
  debug: 1,
};

let loggerConfig: LoggerConfig = { ...DEFAULT_CONFIG };

function shouldLog(level: LogLevel): boolean {
  return PRIORITY[level] >= PRIORITY[loggerConfig.level];
}

function chunkMessage(msg: string): string[] {
  const chunks = [];
  for (let i = 0; i < msg.length; i += 4000) {
    chunks.push(msg.substring(i, i + 4000));
  }
  return chunks;
}

function stringifyMessage(msg: any): string {
  if (msg instanceof Error) {
    return `${msg.name}: ${msg.message}\n${msg.stack}`;
  }

  if (typeof msg === 'object') {
    try {
      return loggerConfig.jsonFormat
        ? JSON.stringify(msg, null, 2)
        : JSON.stringify(msg);
    } catch {
      return String(msg);
    }
  }

  return String(msg);
}

function getCaller(): string {
  const stack = new Error().stack?.split('\n');
  if (!stack || stack.length < 4) return 'unknown';

  const match = stack[3].match(/\((.*):(\d+):\d+\)/) || stack[3].match(/at (.*):(\d+):\d+/);
  if (match) {
    const [, filePath, lineNum] = match;
    const fileName = filePath.split('/').pop();
    return `${fileName}:${lineNum}`;
  }

  return 'unknown';
}

function logFormatted(level: LogLevel, tagOrMsg: any, maybeMsg?: any): void {
  const tag = maybeMsg !== undefined ? tagOrMsg : 'Log';
  const msg = maybeMsg !== undefined ? maybeMsg : tagOrMsg;
  const stringified = stringifyMessage(msg);
  const caller = getCaller();

  chunkMessage(stringified).forEach(chunk => {
    console.log(`${caller} :==> ${tag}, ${chunk}`);
  });
}

export class AppLogger {
  static configure(config: Partial<LoggerConfig>) {
    loggerConfig = { ...loggerConfig, ...config };
  }

  static d(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled || !shouldLog('debug')) return;
    logFormatted('debug', tagOrMsg, maybeMsg);
  }

  static i(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled || !shouldLog('info')) return;
    logFormatted('info', tagOrMsg, maybeMsg);
  }

  static w(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled || !shouldLog('warn')) return;
    logFormatted('warn', tagOrMsg, maybeMsg);
  }

  static e(tagOrMsg: any, maybeMsg?: any): void {
    if (!loggerConfig.enabled || !shouldLog('error')) return;
    logFormatted('error', tagOrMsg, maybeMsg);
  }
}
