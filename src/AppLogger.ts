type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
}

const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  level: 'debug',
};

const COLORS: Record<LogLevel | 'reset', string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  none: '',            // Added to fix TypeScript error
  reset: '\x1b[0m'
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
      return JSON.stringify(msg, null, 2);
    } catch {
      return String(msg);
    }
  }
  return String(msg);
}

function getTimestamp(): string {
  return new Date().toISOString();
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

  // Fallback: try alternate match
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

export class AppLogger {
  static configure(config: Partial<LoggerConfig>) {
    loggerConfig = { ...loggerConfig, ...config };
  }

  static e(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('error')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => logWithColor('error', tag, chunk));
  }

  static w(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('warn')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => logWithColor('warn', tag, chunk));
  }

  static i(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('info')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => logWithColor('info', tag, chunk));
  }

  static d(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('debug')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => logWithColor('debug', tag, chunk));
  }
}
