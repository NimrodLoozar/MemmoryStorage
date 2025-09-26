import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, Dimensions, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AnimatedHeart } from '@/components/AnimatedHeart';
import { faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { memoryImages } from '@/utils/memoryImages';
import { PopupStyles, GalleryStyles, MainStyles } from '@/styles';
import OrientationIcon from '@/components/OrientationIcon';


type ImageFilter = 'all' | 'horizontal' | 'vertical';

export default function HomeScreen() {
  console.log('Memory images loaded:', memoryImages.length, memoryImages);
  
  const [showPopup, setShowPopup] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFilter, setImageFilter] = useState<ImageFilter>('all');
  const [imageOrientations, setImageOrientations] = useState<('horizontal' | 'vertical')[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);
  
  // Get screen width for full-width images
  const screenWidth = Dimensions.get('window').width;
  const [isLargeScreen, setIsLargeScreen] = useState(screenWidth >= 768);

  // Calculate the actual width each image takes up
  const imageItemWidth = screenWidth - 100; // Gallery container padding

  // Listen for screen size changes
  useEffect(() => {
    const updateLayout = (dims: any) => {
      setIsLargeScreen(dims.window.width >= 768);
    };

    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription?.remove();
  }, []);

  // Detect image orientations using onLoad callback
  const handleImageLoad = (index: number, event: any) => {
    const { source } = event;
    if (source && source.width && source.height) {
      const orientation = source.width > source.height ? 'horizontal' : 'vertical';
      setImageOrientations(prev => {
        const newOrientations = [...prev];
        newOrientations[index] = orientation;
        return newOrientations;
      });
    }
  };

  // Filter images based on orientation
  const filteredImages = memoryImages.filter((image, index) => {
    if (imageFilter === 'all') return true;
    if (imageOrientations.length === 0) return true; // Show all if orientations not detected yet
    return imageOrientations[index] === imageFilter;
  });

  // Calculate dynamic height based on current filter and screen size
  const getScrollViewHeight = () => {
    if (imageFilter === 'horizontal') {
      return isLargeScreen ? 460 : 340; // Height for horizontal images
    } else if (imageFilter === 'vertical') {
      return isLargeScreen ? 560 : 440; // Height for vertical images
    } else {
      // Mixed content - use a middle ground
      return isLargeScreen ? 510 : 390;
    }
  };

  // Update current index when filter changes
  useEffect(() => {
    setCurrentImageIndex(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [imageFilter]);

  // Handle scroll events to update current image index
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / imageItemWidth);
    setCurrentImageIndex(Math.max(0, Math.min(index, filteredImages.length - 1)));
  };

  // Render item for FlatList
  const renderImageItem = ({ item, index }: { item: any; index: number }) => {
    const originalIndex = memoryImages.indexOf(item);
    const imageOrientation = imageOrientations[originalIndex] || 'horizontal'; // Default to horizontal if not detected
    
    // Determine container style based on orientation
    const containerStyle = imageOrientation === 'horizontal' 
      ? [
          GalleryStyles.horizontalImageContainer,
          isLargeScreen && GalleryStyles.horizontalImageContainerDesktop,
          { width: imageItemWidth }
        ]
      : [
          GalleryStyles.verticalImageContainer,
          isLargeScreen && GalleryStyles.verticalImageContainerDesktop,
          { width: imageItemWidth }
        ];

    // Determine image style based on orientation and screen size
    const imageStyle = () => {
      if (imageOrientation === 'horizontal') {
        return isLargeScreen ? GalleryStyles.horizontalImageDesktop : GalleryStyles.horizontalImageMobile;
      } else {
        return isLargeScreen ? GalleryStyles.verticalImageDesktop : GalleryStyles.verticalImageMobile;
      }
    };

    console.log(`Rendering image ${index} (${imageOrientation}):`, item);
    return (
      <ThemedView style={containerStyle}>
        <Image
          source={item || require('@/assets/images/sun_kastl.jpg')} // Fallback image
          style={imageStyle()}
          contentFit="contain"
          transition={200}
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          onLoad={(event) => {
            console.log(`Image ${index} loaded successfully`);
            handleImageLoad(originalIndex, event);
          }}
          onError={(error) => console.log(`Image ${index} error:`, error)}
        />
      </ThemedView>
    );
  };

  const handleHeartClick = () => {
    const currentTime = Date.now();
    
    if (clickCount === 0) {
      // First click - start the timer
      setFirstClickTime(currentTime);
      setClickCount(1);
      
      // Reset after 5 seconds if target not reached
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setFirstClickTime(null);
      }, 5000);
      
    } else if (firstClickTime && currentTime - firstClickTime <= 5000) {
      // Within 5 seconds window
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount >= 15) {
        // Target reached! Clear timeout and dismiss popup
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setClickCount(0);
        setFirstClickTime(null);
        setShowPopup(false);
      }
    } else {
      // Outside 5 seconds window - restart
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setFirstClickTime(currentTime);
      setClickCount(1);
      
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setFirstClickTime(null);
      }, 5000);
    }
  };

  const handleMainHeartClick = () => {
    const currentTime = Date.now();
    
    if (clickCount === 0) {
      // First click - start the timer
      setFirstClickTime(currentTime);
      setClickCount(1);
      
      // Reset after 5 seconds if target not reached
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setFirstClickTime(null);
      }, 5000);
      
    } else if (firstClickTime && currentTime - firstClickTime <= 5000) {
      // Within 5 seconds window
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount >= 10) {
        // Target reached! Clear timeout and navigate to secret page
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setClickCount(0);
        setFirstClickTime(null);
        
        // Navigate to secret page
        router.push('/secret-page' as any);
      }
    } else {
      // Outside 5 seconds window - restart
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setFirstClickTime(currentTime);
      setClickCount(1);
      
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setFirstClickTime(null);
      }, 5000);
    }
  };

  return (
    <>
      {/* Full Screen Popup Challenge */}
      <Modal
        visible={showPopup}
        animationType="fade"
        transparent={false}
        statusBarTranslucent={true}
      >
        <ThemedView style={PopupStyles.popupContainer}>
          <ThemedView style={PopupStyles.popupContent}>
            <ThemedText type="title" style={PopupStyles.popupTitle}>
              🔒 Welcome Challenge
            </ThemedText>
            
            <ThemedText style={PopupStyles.popupSubtitle}>
              Before you can access the Memory Storage app, prove your dedication by completing this challenge!
            </ThemedText>
            
            <ThemedView style={PopupStyles.challengeBox}>
              <ThemedText style={PopupStyles.challengeText}>
                Click the heart below{'\n'}
                <ThemedText style={PopupStyles.challengeHighlight}>15 times in 5 seconds</ThemedText>
              </ThemedText>
              
              <AnimatedHeart
                size={60}
                color="#FF1493"
                onPress={handleHeartClick}
                style={PopupStyles.popupHeartContainer}
                activeOpacity={0.7}
                clickCount={clickCount}
              />
              
              {clickCount > 0 && (
                <ThemedView style={PopupStyles.progressContainer}>
                  <ThemedText style={PopupStyles.progressText}>
                    {clickCount}/15 clicks
                  </ThemedText>
                  {firstClickTime && (
                    <ThemedText style={PopupStyles.timerText}>
                      {((Date.now() - firstClickTime) / 1000).toFixed(1)}s / 5.0s
                    </ThemedText>
                  )}
                  <ThemedView style={PopupStyles.progressBar}>
                    <ThemedView 
                      style={[
                        PopupStyles.progressFill, 
                        { width: `${(clickCount / 15) * 100}%` }
                      ]} 
                    />
                  </ThemedView>
                </ThemedView>
              )}
              
              {clickCount === 0 && (
                <ThemedText style={PopupStyles.startText}>
                  Tap the heart to start the challenge!
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Main App Content (only visible after popup is dismissed) */}
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/sun_kastl.jpg')}
            style={MainStyles.reactLogo}
          />
        }
      >
        <ThemedView style={MainStyles.heartContainer}>
          <ThemedView style={MainStyles.content}>
            <ThemedText type="title" style={MainStyles.title}>
              🎉 Secret Page Unlocked! 🎉
            </ThemedText>
            
            <ThemedText style={MainStyles.subtitle}>
              Congratulations! You opened the hidden page by clicking the heart 15 times in 5 seconds!
            </ThemedText>
            
            <ThemedView style={MainStyles.achievementBox}>
              <ThemedText style={MainStyles.achievementTitle}>Achievement Unlocked:</ThemedText>
              <ThemedText style={MainStyles.achievementName}>💖 Heart Clicker Master</ThemedText>
              <ThemedText style={MainStyles.achievementDesc}>
                You have the fastest fingers in the west! Your dedication to heart-clicking is unmatched.
              </ThemedText>
            </ThemedView>
    
            <ThemedText style={MainStyles.funFact}>
              Fun fact: You just performed 10 taps in 5 seconds. That's 2 taps per second! 🚀
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={MainStyles.heartContainer}>
            <AnimatedHeart
              size={24}
              color="#FF1493"
              onPress={handleMainHeartClick}
              activeOpacity={0.7}
              clickCount={clickCount}
            />
            {clickCount > 0 && (
              <ThemedText style={MainStyles.clickCounter}>
                {clickCount}/10 {firstClickTime && ((Date.now() - firstClickTime) / 1000).toFixed(1)}s
              </ThemedText>
            )}
            <ThemedText style={MainStyles.heartHint}>
              💖 Tap the heart 10 times in 5 seconds for a surprise!
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Poem Section - positioned outside gallery container */}
        <ThemedView style={[GalleryStyles.poemSection, !isLargeScreen && GalleryStyles.poemSectionMobile]}>
          <ThemedText style={GalleryStyles.poemTitle}>
            "Memories in Motion"
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Through frames of time, our stories unfold,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Each image a treasure, more precious than gold.
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            In vertical moments and horizontal dreams,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Life captures beauty in digital streams.
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Filter through time, sort through the past,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText]}>
            These memories are made to forever last.
          </ThemedText>
        </ThemedView>

        {/* Gallery positioned below achievement section */}
        <ThemedView style={[GalleryStyles.galleryContainer, !isLargeScreen && GalleryStyles.galleryContainerMobile]}>
          <ThemedText style={GalleryStyles.galleryTitle}>
            📸 Memory Gallery
          </ThemedText>
          
          {/* Filter buttons */}
          <ThemedView style={GalleryStyles.filterButtonsContainer}>
            <TouchableOpacity 
              style={[
                GalleryStyles.filterButton, 
                imageFilter === 'all' && GalleryStyles.filterButtonActive
              ]}
              onPress={() => setImageFilter('all')}
            >
              <ThemedText style={[
                GalleryStyles.filterButtonText,
                imageFilter === 'all' && GalleryStyles.filterButtonTextActive
              ]}>
                All ({memoryImages.length})
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                GalleryStyles.filterButton, 
                imageFilter === 'horizontal' && GalleryStyles.filterButtonActive
              ]}
              onPress={() => setImageFilter('horizontal')}
            >
              <View style={GalleryStyles.filterButtonContent}>
                <View style={GalleryStyles.filterButtonIcon}>
                  <OrientationIcon 
                    width={16} 
                    height={16} 
                    fill={imageFilter === 'horizontal' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'} 
                    rotate={true}
                  />
                </View>
                <ThemedText style={[
                  GalleryStyles.filterButtonText,
                  imageFilter === 'horizontal' && GalleryStyles.filterButtonTextActive
                ]}>
                  Horizontal ({imageOrientations.filter(o => o === 'horizontal').length})
                </ThemedText>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                GalleryStyles.filterButton, 
                imageFilter === 'vertical' && GalleryStyles.filterButtonActive
              ]}
              onPress={() => setImageFilter('vertical')}
            >
              <View style={GalleryStyles.filterButtonContent}>
                <View style={GalleryStyles.filterButtonIcon}>
                  <OrientationIcon 
                    width={16} 
                    height={16} 
                    fill={imageFilter === 'vertical' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'} 
                    rotate={false}
                  />
                </View>
                <ThemedText style={[
                  GalleryStyles.filterButtonText,
                  imageFilter === 'vertical' && GalleryStyles.filterButtonTextActive
                ]}>
                  Vertical ({imageOrientations.filter(o => o === 'vertical').length})
                </ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>
          
          {/* Navigation buttons for better PC support - only show on larger screens */}
          {isLargeScreen && (
            <ThemedView style={GalleryStyles.galleryNavigation}>
              <TouchableOpacity 
                style={[GalleryStyles.navButton, GalleryStyles.prevButton, currentImageIndex === 0 && GalleryStyles.disabledButton]}
                onPress={() => {
                  if (currentImageIndex > 0) {
                    const newIndex = currentImageIndex - 1;
                    setCurrentImageIndex(newIndex);
                    flatListRef.current?.scrollToOffset({ 
                      offset: newIndex * imageItemWidth, 
                      animated: true 
                    });
                  }
                }}
                disabled={currentImageIndex === 0}
              >
                <ThemedText style={[GalleryStyles.navButtonText, currentImageIndex === 0 && GalleryStyles.disabledButtonText]}>
                  ◀ Prev
                </ThemedText>
              </TouchableOpacity>
              
              <ThemedText style={GalleryStyles.imageCounter}>
                {currentImageIndex + 1} / {filteredImages.length}
              </ThemedText>
              
              <TouchableOpacity 
                style={[GalleryStyles.navButton, GalleryStyles.nextButton, currentImageIndex === filteredImages.length - 1 && GalleryStyles.disabledButton]}
                onPress={() => {
                  if (currentImageIndex < filteredImages.length - 1) {
                    const newIndex = currentImageIndex + 1;
                    setCurrentImageIndex(newIndex);
                    flatListRef.current?.scrollToOffset({ 
                      offset: newIndex * imageItemWidth, 
                      animated: true 
                    });
                  }
                }}
                disabled={currentImageIndex === filteredImages.length - 1}
              >
                <ThemedText style={[GalleryStyles.navButtonText, currentImageIndex === filteredImages.length - 1 && GalleryStyles.disabledButtonText]}>
                  Next ▶
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
          
          <FlatList
            ref={flatListRef}
            data={filteredImages}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate={isLargeScreen ? "normal" : "fast"}
            snapToInterval={imageItemWidth}
            snapToAlignment="start"
            disableIntervalMomentum={!isLargeScreen}
            style={[
              GalleryStyles.imageScrollView, 
              { height: getScrollViewHeight() }
            ]}
            keyExtractor={(_, index) => `memory-${index}-${imageFilter}`}
            getItemLayout={(data, index) => ({
              length: imageItemWidth,
              offset: imageItemWidth * index,
              index,
            })}
          />
          
          {/* Dot indicators */}
          <ThemedView style={GalleryStyles.dotsContainer}>
            {filteredImages.map((_, index) => (
              <TouchableOpacity
                key={`dot-${index}-${imageFilter}`}
                style={[
                  GalleryStyles.dot,
                  currentImageIndex === index ? GalleryStyles.activeDot : GalleryStyles.inactiveDot
                ]}
                onPress={() => {
                  setCurrentImageIndex(index);
                  flatListRef.current?.scrollToOffset({ 
                    offset: index * imageItemWidth, 
                    animated: true 
                  });
                }}
              />
            ))}
          </ThemedView>
          
          <ThemedText style={GalleryStyles.galleryHint}>
            {isLargeScreen 
              ? "👆 Swipe to browse • Tap dots or use buttons to navigate • Use filter buttons to switch between image orientations"
              : "👆 Swipe left or right to browse • Tap dots to jump to image • Use orientation filters above"
            }
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
