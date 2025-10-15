import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAdminPassword } from '@/utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    setIsLoading(true);
    
    // Get admin password from environment variables with secure fallback
    const adminPassword = getAdminPassword();
    
    if (password === adminPassword) {
      try {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        Alert.alert('Success', 'Logged in successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]);
      } catch (error) {
        Alert.alert('Error', 'Failed to save login state');
      }
    } else {
      Alert.alert('Error', 'Invalid password');
    }
    
    setIsLoading(false);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.loginBox}>
        <ThemedText style={styles.title}>Admin Login</ThemedText>
        <ThemedText style={styles.subtitle}>Enter password to access upload features</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholderTextColor="#666"
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ThemedText style={styles.backButtonText}>← Back to Gallery</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loginBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});