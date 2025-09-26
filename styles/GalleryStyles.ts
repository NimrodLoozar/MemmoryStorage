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
  
  // Poem section styles (standalone container)
  poemSection: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 20, 147, 0.3)',
  },
  poemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FF1493',
    fontStyle: 'italic',
  },
  poemText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  poemLine: {
    marginBottom: 6,
  },
  poemSectionMobile: {
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
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
    paddingHorizontal: 10,
    minHeight: 200, // Minimum height to ensure small images are visible
    height: 420, // Fixed height for container
  },
//   ######################################################################
//   ######################################################################
  naturalGalleryImage: {
    // Use explicit dimensions for visibility, let contentFit handle aspect ratio
    width: '95%', // Width constraint
    height: 400, // Height constraint  
    resizeMode: 'cover',
  },
//   ######################################################################
//   ######################################################################
  naturalGalleryImageDesktop: {
    width: '39%', // Smaller width for desktop
    height: 400, // Higher height for desktop
    // marginTop: 100,
    borderRadius: 15,
    borderWidth: 5, // Border will wrap around the actual image size
    borderColor: 'rgba(255, 20, 147, 0.3)',  
},
  naturalGalleryImageMobile: {
    minWidth: 240, // Larger width for mobile
    maxWidth: '90%', // Fit better within mobile container
    minHeight: '100%', // Lower height for mobile
    borderRadius: 15,
    borderWidth: 5, // Border will wrap around the actual image size
    borderColor: 'rgba(255, 20, 147, 0.3)',
    
  },
  
  // Orientation-specific styles for mobile
  horizontalImageMobile: {
    width: '95%',
    height: 280, // Shorter height for landscape images on mobile
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 20, 147, 0.4)',
  },
  verticalImageMobile: {
    width: '85%',
    height: 380, // Taller height for portrait images on mobile
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 20, 147, 0.4)',
  },
  
  // Orientation-specific styles for desktop
  horizontalImageDesktop: {
    width: '70%',
    height: 400, // Good height for landscape images on desktop
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'rgba(255, 20, 147, 0.5)',
  },
  verticalImageDesktop: {
    width: '50%',
    height: 500, // Taller height for portrait images on desktop
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'rgba(255, 20, 147, 0.5)',
  },
  
  // Container adjustments for different orientations
  horizontalImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 320, // Container height for horizontal images
  },
  verticalImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 420, // Container height for vertical images
  },
  horizontalImageContainerDesktop: {
    height: 440, // Taller container for desktop horizontal images
  },
  verticalImageContainerDesktop: {
    height: 540, // Even taller container for desktop vertical images
  },
  
  // Filter buttons styles
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 20, 147, 0.3)',
    minWidth: 70,
    alignItems: 'center',
    flex: 1,
    maxWidth: 130,
  },
  filterButtonActive: {
    backgroundColor: '#FF1493',
    borderColor: '#FF1493',
  },
  filterButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  filterButtonIcon: {
    marginRight: 6,
    backgroundColor: 'transparent',
  },
});
