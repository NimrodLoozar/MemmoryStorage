import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Logger } from '@/utils/logger';
import React from 'react';
import { Alert } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';

interface UploadErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Specialized Error Boundary for Upload Operations
 * Handles errors during image upload, compression, and storage
 */
export const UploadErrorBoundary: React.FC<UploadErrorBoundaryProps> = ({ children }) => {
  const handleUploadError = (error: Error, errorInfo: React.ErrorInfo) => {
    Logger.error('Upload Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Show specific alert for upload errors
    Alert.alert(
      'Upload Error',
      'There was an issue uploading your image. Your photo was not saved. Please try again.',
      [
        {
          text: 'Try Again',
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );

    // TODO: Send upload-specific analytics
    // Analytics.recordEvent('upload_error', {
    //   error_message: error.message,
    //   error_type: 'upload_component',
    // });
  };

  const uploadFallback = (
    <ThemedView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff3cd',
      borderRadius: 8,
      margin: 16,
      borderWidth: 1,
      borderColor: '#ffeaa7',
    }}>
      <ThemedText style={{
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
        color: '#856404',
      }}>
        📤 Upload temporarily unavailable
      </ThemedText>
      
      <ThemedText style={{
        fontSize: 14,
        textAlign: 'center',
        color: '#856404',
        marginBottom: 16,
      }}>
        We're having trouble with image uploads right now. 
        Please try again in a moment.
      </ThemedText>

      <ThemedText style={{
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#856404',
      }}>
        You can still view your existing photos while we fix this.
      </ThemedText>
    </ThemedView>
  );

  return (
    <ErrorBoundary
      fallback={uploadFallback}
      onError={handleUploadError}
      showDetails={__DEV__}
    >
      {children}
    </ErrorBoundary>
  );
};

export default UploadErrorBoundary;