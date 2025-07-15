import Config from './config';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export type DebugModule = 'client' | 'server' | 'ui';

export class DebugLogger {
  private static instance: DebugLogger;
  private resourceName: string;

  constructor() {
    this.resourceName = GetCurrentResourceName();
  }

  public static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private shouldLog(module: DebugModule, level: LogLevel): boolean {
    // Check if debug is enabled globally
    if (!Config.Debug.enabled) {
      return false;
    }

    // Check if the specific module is enabled
    if (!Config.Debug.modules[module]) {
      return false;
    }

    // Check log level (simplified - you can enhance this)
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(Config.Debug.logLevel);
    const currentLevelIndex = levels.indexOf(level);

    return currentLevelIndex >= configLevelIndex;
  }

  private formatMessage(module: DebugModule, level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.resourceName}] [${module.toUpperCase()}] [${level.toUpperCase()}]`;
    
    let formattedMessage = `${prefix} ${message}`;
    
    if (args.length > 0) {
      formattedMessage += ' ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
    }
    
    return formattedMessage;
  }

  public log(module: DebugModule, level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(module, level)) {
      return;
    }

    const formattedMessage = this.formatMessage(module, level, message, ...args);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
      case 'info':
      default:
        console.log(formattedMessage);
        break;
    }
  }

  // Convenience methods
  public info(module: DebugModule, message: string, ...args: any[]): void {
    this.log(module, 'info', message, ...args);
  }

  public warn(module: DebugModule, message: string, ...args: any[]): void {
    this.log(module, 'warn', message, ...args);
  }

  public error(module: DebugModule, message: string, ...args: any[]): void {
    this.log(module, 'error', message, ...args);
  }

  public debug(module: DebugModule, message: string, ...args: any[]): void {
    this.log(module, 'debug', message, ...args);
  }
}

// Export singleton instance
export const Debug = DebugLogger.getInstance();
