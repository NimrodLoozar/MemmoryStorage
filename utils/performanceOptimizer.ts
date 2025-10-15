/**
 * Performance Optimization Utilities for Memory Storage App
 * 
 * This module provides optimized functions and configurations for better app performance:
 * - Image lazy loading utilities
 * - Storage operation optimizations
 * - FlatList performance configurations
 * - Memory management utilities
 */

import { useCallback, useMemo } from 'react';

// Performance configuration constants
export const PERFORMANCE_CONFIG = {
  // FlatList optimization settings
  FLATLIST: {
    removeClippedSubviews: true,
    maxToRenderPerBatch: 3,
    windowSize: 5,
    initialNumToRender: 2,
    updateCellsBatchingPeriod: 50,
    legacyImplementation: false,
    scrollEventThrottle: 16,
  },
  
  // Image processing optimization
  IMAGE: {
    maxDimension: 600,
    compressionQuality: 0.5,
    smallImageThreshold: 500 * 1024, // 500KB
    lazyLoadingOffset: 100,
  },
  
  // Storage optimization thresholds
  STORAGE: {
    asyncStorageLimit: 5 * 1024 * 1024, // 5MB
    indexedDBChunkSize: 1 * 1024 * 1024, // 1MB chunks
    cacheCleanupThreshold: 100, // Max cached items
  },
  
  // Memory management
  MEMORY: {
    maxConcurrentOperations: 3,
    debounceTimeout: 300,
    throttleInterval: 100,
  }
};

// Optimized image processing utilities
export class ImageOptimizer {
  // Canvas-based image compression with performance monitoring
  static async compressImage(
    file: File | Blob, 
    maxDimension: number = PERFORMANCE_CONFIG.IMAGE.maxDimension,
    quality: number = PERFORMANCE_CONFIG.IMAGE.compressionQuality
  ): Promise<Blob> {
    const startTime = performance.now();
    
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate optimal dimensions
        const { width, height } = this.calculateOptimalDimensions(
          img.width, 
          img.height, 
          maxDimension
        );
        
        canvas.width = width;
        canvas.height = height;
        
        // High-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const endTime = performance.now();
            console.log(`Image compression took ${endTime - startTime}ms`);
            resolve(blob!);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  // Calculate optimal dimensions for performance
  static calculateOptimalDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxDimension: number
  ): { width: number; height: number } {
    if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
      return { width: originalWidth, height: originalHeight };
    }
    
    const aspectRatio = originalWidth / originalHeight;
    
    if (originalWidth > originalHeight) {
      return {
        width: maxDimension,
        height: Math.round(maxDimension / aspectRatio)
      };
    } else {
      return {
        width: Math.round(maxDimension * aspectRatio),
        height: maxDimension
      };
    }
  }
}

// Smart storage manager with performance optimization
export class OptimizedStorageManager {
  private static operationQueue: Array<() => Promise<any>> = [];
  private static isProcessing = false;
  
  // Queue-based storage operations to prevent blocking
  static async queueOperation<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.operationQueue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
  
  // Process storage operations with concurrency control
  private static async processQueue() {
    if (this.isProcessing || this.operationQueue.length === 0) return;
    
    this.isProcessing = true;
    
    const batch = this.operationQueue.splice(
      0, 
      PERFORMANCE_CONFIG.MEMORY.maxConcurrentOperations
    );
    
    try {
      await Promise.all(batch.map(op => op()));
    } finally {
      this.isProcessing = false;
      
      // Process next batch if queue has items
      if (this.operationQueue.length > 0) {
        setTimeout(() => this.processQueue(), 0);
      }
    }
  }
  
  // Optimized storage type detection
  static determineOptimalStorage(dataSize: number): 'asyncStorage' | 'indexedDB' | 'session' {
    if (dataSize < PERFORMANCE_CONFIG.IMAGE.smallImageThreshold) {
      return 'asyncStorage'; // Fast access for small images
    } else if (dataSize < PERFORMANCE_CONFIG.STORAGE.indexedDBChunkSize * 10) {
      return 'indexedDB'; // Large capacity for big images
    } else {
      return 'session'; // Session-only for very large files
    }
  }
}

// Performance monitoring hooks
export function usePerformanceMonitor(componentName: string) {
  const renderTime = useMemo(() => performance.now(), []);
  
  return useCallback(() => {
    const currentTime = performance.now();
    const duration = currentTime - renderTime;
    
    if (duration > 16) { // Longer than one frame (60fps)
      console.warn(`Performance warning: ${componentName} render took ${duration.toFixed(2)}ms`);
    }
  }, [componentName, renderTime]);
}

// Debounced function utility for performance
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = PERFORMANCE_CONFIG.MEMORY.debounceTimeout
): T {
  return useCallback(
    (...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => func(...args), delay);
      return () => clearTimeout(timeoutId);
    },
    [func, delay]
  ) as T;
}

// Optimized image cache with LRU eviction
export class ImageCache {
  private static cache = new Map<string, { blob: Blob; lastAccessed: number }>();
  private static maxSize = PERFORMANCE_CONFIG.STORAGE.cacheCleanupThreshold;
  
  static set(key: string, blob: Blob): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      // Remove oldest 25% of entries
      const toRemove = Math.floor(this.maxSize * 0.25);
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.cache.delete(entries[i]![0]);
      }
    }
    
    this.cache.set(key, {
      blob,
      lastAccessed: Date.now()
    });
  }
  
  static get(key: string): Blob | null {
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastAccessed = Date.now();
      return entry.blob;
    }
    return null;
  }
  
  static clear(): void {
    this.cache.clear();
  }
  
  static getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}

// Performance-optimized event handlers
export const createOptimizedHandlers = () => {
  const throttledScroll = useCallback(
    throttle((handler: (event: any) => void) => {
      return (event: any) => handler(event);
    }, PERFORMANCE_CONFIG.MEMORY.throttleInterval),
    []
  );
  
  const debouncedSearch = useCallback(
    debounce((handler: (query: string) => void) => {
      return (query: string) => handler(query);
    }, PERFORMANCE_CONFIG.MEMORY.debounceTimeout),
    []
  );
  
  return { throttledScroll, debouncedSearch };
};

// Utility functions
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}