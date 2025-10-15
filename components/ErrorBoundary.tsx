import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Logger } from '@/utils/logger';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    Logger.error('ErrorBoundary caught an error:', error);
    Logger.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to crash reporting service
    // Analytics.recordError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    // For web, reload the page
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      // For native, just retry
      this.handleRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.errorCard}>
            <ThemedText style={styles.errorTitle}>
              🚨 Something went wrong
            </ThemedText>
            
            <ThemedText style={styles.errorMessage}>
              We're sorry! An unexpected error occurred. This has been logged and we'll investigate.
            </ThemedText>

            {this.props.showDetails && this.state.error && (
              <ThemedView style={styles.errorDetails}>
                <ThemedText style={styles.errorDetailsTitle}>
                  Technical Details:
                </ThemedText>
                <ThemedText style={styles.errorDetailsText}>
                  {this.state.error.message}
                </ThemedText>
                {__DEV__ && this.state.error.stack && (
                  <ThemedText style={styles.errorStack}>
                    {this.state.error.stack}
                  </ThemedText>
                )}
              </ThemedView>
            )}

            <ThemedView style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={this.handleRetry}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.reloadButton]}
                onPress={this.handleReload}
              >
                <Text style={styles.buttonText}>Reload App</Text>
              </TouchableOpacity>
            </ThemedView>

            {__DEV__ && (
              <ThemedText style={styles.devNote}>
                🔧 Development Mode: Check console for detailed error logs
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
    maxWidth: 500,
    width: '100%',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#dc3545',
  },
  errorMessage: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
  },
  errorDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorDetailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  errorDetailsText: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'monospace',
  },
  errorStack: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
  },
  reloadButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  devNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    color: '#6c757d',
  },
});

export default ErrorBoundary;