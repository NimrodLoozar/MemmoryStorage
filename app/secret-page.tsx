import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SecretPage() {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesomeIcon icon={faArrowLeft as any} size={20} color="#007AFF" />
        <ThemedText style={styles.backText}>Back</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.content}>
        <FontAwesomeIcon icon={faTrophy as any} size={80} color="#FFD700" />
        
        <ThemedText type="title" style={styles.title}>
          🎉 Secret Page Unlocked! 🎉
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Congratulations! You discovered the hidden easter egg by clicking the heart 10 times in 5 seconds!
        </ThemedText>
        
        <ThemedView style={styles.achievementBox}>
          <ThemedText style={styles.achievementTitle}>Achievement Unlocked:</ThemedText>
          <ThemedText style={styles.achievementName}>💖 Heart Clicker Master</ThemedText>
          <ThemedText style={styles.achievementDesc}>
            You have the fastest fingers in the west! Your dedication to heart-clicking is unmatched.
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.funFact}>
          Fun fact: You just performed 10 taps in 5 seconds. That's 2 taps per second! 🚀
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.8,
  },
  achievementBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  achievementName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFD700',
  },
  achievementDesc: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  funFact: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
    lineHeight: 20,
  },
});
