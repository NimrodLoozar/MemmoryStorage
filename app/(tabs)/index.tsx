import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Modal, TouchableOpacity, View } from 'react-native';

import { AnimatedHeart } from '@/components/AnimatedHeart';
import { ImageWithTightBorder } from '@/components/ImageWithTightBorder';
import OrientationIcon from '@/components/OrientationIcon';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GalleryStyles, MainStyles, PopupStyles } from '@/styles';
import { memoryImages } from '@/utils/memoryImages';


type ImageFilter = 'all' | 'horizontal' | 'vertical';

export default function HomeScreen() {
  console.log('Memory images loaded:', memoryImages.length, memoryImages);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [allImages, setAllImages] = useState(memoryImages);
  
  const [showPopup, setShowPopup] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFilter, setImageFilter] = useState<ImageFilter>('all');
  const [imageOrientations, setImageOrientations] = useState<('horizontal' | 'vertical')[]>([]);
  const flatListRef = useRef<FlatList>(null);
  
  // Authentication functions
  const loadAuthState = async () => {
    try {
      const savedAuthState = await AsyncStorage.getItem('isLoggedIn');
      const savedImages = await AsyncStorage.getItem('uploadedImages');
      
      if (savedAuthState === 'true') {
        setIsLoggedIn(true);
      }
      
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        setUploadedImages(parsedImages);
        setAllImages([...memoryImages, ...parsedImages]);
      }
    } catch (error) {
      console.log('Error loading auth state:', error);
    }
  };
  
  const login = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };
  
  const logout = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };
  
  // Image upload functions
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await saveUploadedImage(asset);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const saveUploadedImage = async (asset: any) => {
    try {
      const filename = `uploaded_${Date.now()}.${asset.uri.split('.').pop()}`;
      
      const newImage = {
        uri: asset.uri, // Use the original URI directly
        width: asset.width,
        height: asset.height,
        filename: filename,
        isUploaded: true
      };
      
      const updatedUploadedImages = [...uploadedImages, newImage];
      const updatedAllImages = [...allImages, newImage];
      
      setUploadedImages(updatedUploadedImages);
      setAllImages(updatedAllImages);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('uploadedImages', JSON.stringify(updatedUploadedImages));
      
      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
      console.log('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };
  
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
  
  // Load authentication state on mount
  useEffect(() => {
    loadAuthState();
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

  // Filter images based on orientation (now using allImages including uploaded ones)
  const filteredImages = allImages.filter((image, index) => {
    if (imageFilter === 'all') return true;
    if (imageOrientations.length === 0) return true; // Show all if orientations not detected yet
    return imageOrientations[index] === imageFilter;
  });

  // Calculate dynamic height based on current filter and screen size
  const getScrollViewHeight = () => {
    // Further increased heights for bigger images with minimal spacing
    return isLargeScreen ? 620 : 540;
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
    const originalIndex = allImages.indexOf(item);
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

    console.log(`Rendering image ${index} (${imageOrientation}):`, item);
    return (
      <ThemedView style={containerStyle}>
        <ImageWithTightBorder
          source={item.isUploaded ? { uri: item.uri } : (item || require('@/assets/images/sun_kastl.jpg'))} // Handle uploaded images
          orientation={imageOrientation}
          isLargeScreen={isLargeScreen}
          containerStyle={{ flex: 1, width: '100%', height: '100%' }}
          onImageLoad={(event) => {
            console.log(`Image ${index} loaded successfully`);
            handleImageLoad(originalIndex, event);
          }}
        />
      </ThemedView>
    );
  };

  const handleHeartClick = () => {
    setShowPopup(false);
  };

  const handleMainHeartClick = () => {
    if (!isLoggedIn) {
      // Navigate to login page
      router.push('/login' as any);
    } else {
      // Navigate to secret page if logged in
      router.push('/secret-page');
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
              />
              
              <ThemedText style={PopupStyles.startText}>
                Tap the heart to enter the gallery!
              </ThemedText>
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
            />
            <ThemedText style={MainStyles.heartHint}>
              💖 {isLoggedIn ? 'Tap the heart to visit the secret page!' : 'Tap the heart to login for admin features!'}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Poem Section - positioned outside gallery container */}
        <ThemedView style={[GalleryStyles.poemSection, !isLargeScreen && GalleryStyles.poemSectionMobile]}>
          <ThemedText style={GalleryStyles.poemTitle}>
            "Szeretlek"
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Kérdezd: szeretlek-e? s megmondom én, hogy
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Szeretlek, mert ezt mondhatom;
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            De oh ne kérdezd: mennyire szeretlek?
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Mert én azt magam sem tudom!
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Azt tudni csak, hogy mély a tengerszem,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            De milyen mély? nem tudja senki sem.
          </ThemedText>
          <ThemedView style={{ marginBottom: 15 }} />
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Mondhatnék esküt, hosszu és nagy esküt,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Az ég felé tartván kezem,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Hogy szívem minden dobbanása érted
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            És egyedűl érted leszen,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Hogy öröklámpa benne a hüség,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Mely még ott lenn a föld alatt is ég.
          </ThemedText>
          <ThemedView style={{ marginBottom: 15 }} />
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            S mondhatnék átkot, hosszu és nagy átkot,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Mely, mint a villám, érjen el,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            S égesse, tépje lelkemet legmélyebb
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Pokolba mártott körmivel,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Ha elfeledlek téged, kedvesem,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Sőt ha rólad csak megfeledkezem.
          </ThemedText>
          <ThemedView style={{ marginBottom: 15 }} />
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Nem mondok esküt és átkot. Jaj annak,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Jaj, akit ez tart vissza csak.
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Én eskü s átok nélkül is örökre
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Lelkem lelkében tartalak,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Ott fogsz te állni magas-fényesen,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Mint a tejút a legmagasb egen.
          </ThemedText>
          <ThemedView style={{ marginBottom: 15 }} />
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            S örök hűségem, oh ez a hüség is
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Még a te érdemed csupán;
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Hogy szerethetne mást többé, akit te
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Megszeretél, dicső leány?
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText, GalleryStyles.poemLine]}>
            Ki egyszer már a mennybe szállt vala,
          </ThemedText>
          <ThemedText style={[GalleryStyles.poemText]}>
            Nem látja azt a föld többé soha!
          </ThemedText>
        </ThemedView>

        {/* Gallery positioned below achievement section */}
        <ThemedView style={[GalleryStyles.galleryContainer, !isLargeScreen && GalleryStyles.galleryContainerMobile]}>
          <ThemedText style={GalleryStyles.galleryTitle}>
            📸 Memory Gallery
          </ThemedText>
          
          {/* Admin Controls - only show when logged in */}
          {isLoggedIn && (
            <ThemedView style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
              paddingHorizontal: 10,
            }}>
              <TouchableOpacity 
                style={[
                  GalleryStyles.navButton,
                  { backgroundColor: '#28a745', minWidth: 100 }
                ]}
                onPress={pickImage}
              >
                <ThemedText style={GalleryStyles.navButtonText}>
                  📷 Upload Image
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  GalleryStyles.navButton,
                  { backgroundColor: '#dc3545', minWidth: 80 }
                ]}
                onPress={logout}
              >
                <ThemedText style={GalleryStyles.navButtonText}>
                  🔐 Logout
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
          
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
                All ({allImages.length})
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
