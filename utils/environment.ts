// Environment configuration utility
// This file helps test and access environment variables safely

import Constants from 'expo-constants';

export interface EnvironmentConfig {
  adminPassword: string;
  appSecret: string;
  environment: string;
  maxImageSize: number;
  defaultCompressionQuality: number;
}

/**
 * Get environment configuration with fallbacks
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const extra = Constants.expoConfig?.extra;
  
  return {
    adminPassword: extra?.adminPassword || 'admin123',
    appSecret: extra?.appSecret || 'default_secret_key',
    environment: extra?.environment || 'development',
    maxImageSize: parseInt(extra?.maxImageSize || '5242880', 10),
    defaultCompressionQuality: parseFloat(extra?.defaultCompressionQuality || '0.7')
  };
};

/**
 * Check if we're in production environment
 */
export const isProduction = (): boolean => {
  const config = getEnvironmentConfig();
  return config.environment === 'production';
};

/**
 * Check if we're in development environment
 */
export const isDevelopment = (): boolean => {
  const config = getEnvironmentConfig();
  return config.environment === 'development';
};

/**
 * Get admin password securely
 */
export const getAdminPassword = (): string => {
  const config = getEnvironmentConfig();
  return config.adminPassword;
};

/**
 * Log environment configuration (only in development)
 */
export const logEnvironmentConfig = (): void => {
  if (isDevelopment()) {
    const config = getEnvironmentConfig();
    console.log('🔧 Environment Configuration:', {
      environment: config.environment,
      maxImageSize: config.maxImageSize,
      defaultCompressionQuality: config.defaultCompressionQuality,
      hasAdminPassword: !!config.adminPassword,
      hasAppSecret: !!config.appSecret
    });
  }
};