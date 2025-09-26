import { StyleSheet } from 'react-native';

export const MainStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        position: 'absolute',
        resizeMode: 'cover',
    },
    heartContainer: {
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
        borderWidth: 0,
    },
    clickCounter: {
        marginTop: 8,
        fontSize: 12,
        opacity: 0.7,
    },
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
    heartHint: {
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.6,
        fontStyle: 'italic',
        marginTop: 5,
    },
    // Natural aspect ratio image styles
    naturalImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0,
        minHeight: 200, // Minimum height to ensure visibility
        // Remove container border and styling
    },
    naturalImage: {
        // No fixed width/height - let image determine its own size
        maxWidth: '95%', // Maximum width constraint
        maxHeight: 400, // Maximum height constraint
        
        // Image displays at natural size within max constraints
    },
    naturalImageDesktop: {
        maxWidth: '70%', // Smaller max width for desktop
        maxHeight: 500, // Higher max height for desktop
    },
    naturalImageMobile: {
        maxWidth: '90%', // Larger max width for mobile
        maxHeight: 350, // Lower max height for mobile
        borderRadius: 15,
        borderWidth: 2, // Border will wrap around the actual image size
        borderColor: 'rgba(255, 20, 147, 0.3)',
    },
});
