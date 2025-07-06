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

const COLORS: Record<LogLevel | 'reset', string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  none: '',
  reset: '\x1b[0m',
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

function stringifyError(msg: any): string {
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
  const err = new Error();
  const stack = err.stack?.split('\n');
  if (!stack || stack.length < 4) return 'unknown';

  const match = stack[3].match(/\((.*):(\d+):\d+\)/);
  if (match) {
    const [, filePath, lineNum] = match;
    const fileName = filePath.split('/').pop();
    return `${fileName}:${lineNum}`;
  }

  const altMatch = stack[3].match(/at (.*):(\d+):\d+/);
  if (altMatch) {
    const [, filePath, lineNum] = altMatch;
    const fileName = filePath.split('/').pop();
    return `${fileName}:${lineNum}`;
  }

  return 'unknown';
}

function logWithColor(level: LogLevel, tag: string, chunk: string): void {
  const caller = getCaller();
  console.log(`${caller} :==> ${tag}, ${chunk}`);
}

function handleLog(level: LogLevel, tagOrMsg: any, maybeMsg?: any): void {
  if (!loggerConfig.enabled || !shouldLog(level)) return;

  const tag = maybeMsg !== undefined ? tagOrMsg : 'Log';
  const msg = maybeMsg !== undefined ? maybeMsg : tagOrMsg;
  const stringified = stringifyError(msg);

  chunkMessage(stringified).forEach(chunk => {
    logWithColor(level, tag, chunk);
  });
}

export class AppLogger {
  static configure(config: Partial<LoggerConfig>) {
    loggerConfig = { ...loggerConfig, ...config };
  }

  static e(tagOrMsg: any, maybeMsg?: any): void {
    handleLog('error', tagOrMsg, maybeMsg);
  }

  static w(tagOrMsg: any, maybeMsg?: any): void {
    handleLog('warn', tagOrMsg, maybeMsg);
  }

  static i(tagOrMsg: any, maybeMsg?: any): void {
    handleLog('info', tagOrMsg, maybeMsg);
  }

  static d(tagOrMsg: any, maybeMsg?: any): void {
    handleLog('debug', tagOrMsg, maybeMsg);
  }
}
