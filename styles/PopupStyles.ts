import { StyleSheet } from 'react-native';

export const PopupStyles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    alignItems: 'center',
    padding: 30,
    width: '90%',
    maxWidth: 400,
  },
  popupTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 28,
  },
  popupSubtitle: {
    color: '#CCCCCC',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  challengeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 20, 147, 0.5)',
  },
  challengeText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  challengeHighlight: {
    color: '#FF1493',
    fontWeight: 'bold',
    fontSize: 20,
  },
  popupHeartContainer: {
    padding: 20,
    marginVertical: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    borderWidth: 0,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timerText: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF1493',
    borderRadius: 4,
  },
  startText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
});
