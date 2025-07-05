type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
}

const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  level: 'debug',
};

let loggerConfig: LoggerConfig = { ...DEFAULT_CONFIG };

function chunkMessage(msg: string): string[] {
  const chunks = [];
  let i = 0;
  while (i < msg.length) {
    chunks.push(msg.substring(i, i + 4000));
    i += 4000;
  }
  return chunks;
}

function stringifyError(error: any): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack}`;
  }
  return typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error);
}

function shouldLog(level: LogLevel): boolean {
  const priority = {
    none: 5,
    error: 4,
    warn: 3,
    info: 2,
    debug: 1,
  };
  return priority[level] >= priority[loggerConfig.level];
}

export class AppLogger {
  static configure(config: Partial<LoggerConfig>) {
    loggerConfig = { ...loggerConfig, ...config };
  }

  static e(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('error')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => console.error(`[${tag}] ${chunk}`));
  }

  static w(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('warn')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => console.warn(`[${tag}] ${chunk}`));
  }

  static i(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('info')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => console.log(`[${tag}] ${chunk}`));
  }

  static d(tag: string, msg: any): void {
    if (!loggerConfig.enabled || !shouldLog('debug')) return;
    chunkMessage(stringifyError(msg)).forEach(chunk => console.debug(`[${tag}] ${chunk}`));
  }
}
