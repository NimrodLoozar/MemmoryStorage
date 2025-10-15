import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Logger } from '@/utils/logger';
import React from 'react';
import { Alert } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';

interface GalleryErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Specialized Error Boundary for Gallery Component
 * Provides gallery-specific error handling and recovery options
 */
export const GalleryErrorBoundary: React.FC<GalleryErrorBoundaryProps> = ({ children }) => {
  const handleGalleryError = (error: Error, errorInfo: React.ErrorInfo) => {
    Logger.error('Gallery Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Show user-friendly alert for gallery errors
    Alert.alert(
      'Gallery Error',
      'There was an issue with the photo gallery. The app will attempt to recover automatically.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );

    // TODO: Send gallery-specific analytics
    // Analytics.recordEvent('gallery_error', {
    //   error_message: error.message,
    //   error_type: 'gallery_component',
    // });
  };

  const galleryFallback = (
    <ThemedView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <ThemedText style={{
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
      }}>
        📸 Gallery temporarily unavailable
      </ThemedText>
      
      <ThemedText style={{
        fontSize: 14,
        textAlign: 'center',
        color: '#6c757d',
        marginBottom: 20,
      }}>
        We're having trouble loading your photos right now. 
        Please try refreshing the app or check back in a moment.
      </ThemedText>

      <ThemedText style={{
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#6c757d',
      }}>
        Your photos are safe - this is just a temporary display issue.
      </ThemedText>
    </ThemedView>
  );

  return (
    <ErrorBoundary
      fallback={galleryFallback}
      onError={handleGalleryError}
      showDetails={__DEV__}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GalleryErrorBoundary;