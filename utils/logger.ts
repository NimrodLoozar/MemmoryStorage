// Production-safe logging utility
// Only logs in development, silent in production

import { isDevelopment } from './environment';

/**
 * Production-safe logger that only outputs in development mode
 * In production builds, all logging calls are no-ops to prevent console spam
 */
export class Logger {
  /**
   * Log informational messages (development only)
   */
  static info(message: string, ...args: any[]): void {
    if (isDevelopment()) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log debug messages (development only)
   */
  static debug(message: string, ...args: any[]): void {
    if (isDevelopment()) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log error messages (development only, but should be replaced with proper error handling)
   */
  static error(message: string, error?: any): void {
    if (isDevelopment()) {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, errors should be sent to crash reporting
    // TODO: Add crash reporting service integration here
  }

  /**
   * Log warning messages (development only)
   */
  static warn(message: string, ...args: any[]): void {
    if (isDevelopment()) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Log user actions for analytics (can be used in production)
   */
  static analytics(event: string, data?: any): void {
    if (isDevelopment()) {
      console.log(`[ANALYTICS] ${event}`, data);
    }
    // In production, send to analytics service
    // TODO: Add analytics service integration here
  }

  /**
   * Log performance metrics (development only)
   */
  static performance(operation: string, duration?: number): void {
    if (isDevelopment()) {
      const timeStr = duration ? ` (${duration}ms)` : '';
      console.log(`[PERF] ${operation}${timeStr}`);
    }
  }

  /**
   * Group related log messages (development only)
   */
  static group(label: string): void {
    if (isDevelopment()) {
      console.group(label);
    }
  }

  /**
   * End log group (development only)
   */
  static groupEnd(): void {
    if (isDevelopment()) {
      console.groupEnd();
    }
  }
}

/**
 * Convenience functions for common logging patterns
 */
export const log = {
  // State management
  state: (component: string, state: any) => 
    Logger.debug(`${component} state update`, state),
  
  // API calls
  api: (endpoint: string, method: string, data?: any) =>
    Logger.info(`API ${method} ${endpoint}`, data),
  
  // Storage operations
  storage: (operation: string, key?: string, data?: any) =>
    Logger.debug(`Storage ${operation}${key ? ` (${key})` : ''}`, data),
  
  // Image operations
  image: (operation: string, details?: any) =>
    Logger.debug(`Image ${operation}`, details),
  
  // Authentication
  auth: (action: string, details?: any) =>
    Logger.info(`Auth ${action}`, details),
  
  // Navigation
  navigation: (action: string, route?: string) =>
    Logger.debug(`Navigation ${action}${route ? ` to ${route}` : ''}`),
  
  // Performance tracking
  perf: (operation: string, startTime: number) => {
    const duration = Date.now() - startTime;
    Logger.performance(operation, duration);
  }
};

export default Logger;