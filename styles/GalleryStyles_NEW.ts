import { StyleSheet } from 'react-native';

export const GalleryStyles = StyleSheet.create({
  galleryContainer: {
    marginTop: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  galleryContainerMobile: {
    paddingTop: 15,
    marginTop: 20,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#FF1493',
  },
  imageScrollView: {
    marginVertical: 10,
    height: 450, // Increased height to accommodate larger images
    width: '100%',
    resizeMode: 'cover',
  },
  imageScrollViewDesktop: {
    height: 550, // Much taller container for desktop images
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  galleryImage: {
    width: '95%',
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 20, 147, 0.3)',
  },
  galleryImageDesktop: {
    width: '60%', // Narrower on desktop
    height: 280, // Taller on desktop
  },
  galleryImageMobile: {
    width: '90%', // Fit better within mobile container
    height: 180, // Slightly shorter on mobile for better fit
  },
  galleryHint: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 10,
  },
  
  // Dot indicators
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF1493',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Gallery navigation styles
  galleryNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF1493',
    minWidth: 70,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#FF1493',
  },
  nextButton: {
    backgroundColor: '#FF1493',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  imageCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF1493',
    textAlign: 'center',
  },
  // Natural aspect ratio styles for gallery images
  naturalImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    minHeight: 200, // Minimum height to ensure small images are visible
  },
  naturalGalleryImage: {
    // No fixed width/height - let image determine its own size
    maxWidth: '95%', // Maximum width constraint
    maxHeight: 400, // Maximum height constraint  
    borderRadius: 15,
    borderWidth: 2, // Border will wrap around the actual image size
    borderColor: 'rgba(255, 20, 147, 0.3)',
    // Image displays at natural size within max constraints
  },
  naturalGalleryImageDesktop: {
    maxWidth: '70%', // Smaller max width for desktop
    maxHeight: 500, // Higher max height for desktop
  },
  naturalGalleryImageMobile: {
    maxWidth: '90%', // Larger max width for mobile
    maxHeight: 350, // Lower max height for mobile
  },
});
