import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Modal, Platform, TouchableOpacity, View } from 'react-native';

import { AnimatedHeart } from '@/components/AnimatedHeart';
import { ImageWithTightBorder } from '@/components/ImageWithTightBorder';
import OrientationIcon from '@/components/OrientationIcon';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GalleryStyles, MainStyles, PopupStyles } from '@/styles';
import Logger from '@/utils/logger';
import { memoryImages } from '@/utils/memoryImages';

type ImageFilter = 'all' | 'horizontal' | 'vertical';

export default function HomeScreen() {
  // App state management
  const [isLoading, setIsLoading] = useState(true);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [allImages, setAllImages] = useState(memoryImages);
  
  // Challenge state
  const [clickCount, setClickCount] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState<number | null>(null);
  
  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFilter, setImageFilter] = useState<ImageFilter>('all');
  const [imageOrientations, setImageOrientations] = useState<('horizontal' | 'vertical')[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);
  
  // Authentication functions
  const loadAuthState = async () => {
    try {
      const savedAuthState = await AsyncStorage.getItem('isLoggedIn');
      
      if (savedAuthState === 'true') {
        setIsLoggedIn(true);
      }
      
      // Load from both AsyncStorage (small images) and IndexedDB (large images)
      const [asyncStorageImages, indexedDBImages] = await Promise.all([
        AsyncStorage.getItem('uploadedImages').then(data => 
          data ? JSON.parse(data) : []
        ).catch(() => []),
        Platform.OS === 'web' ? loadImagesFromIndexedDB() : Promise.resolve([])
      ]);
      
      // Combine all uploaded images
      const allUploadedImages = [...asyncStorageImages, ...indexedDBImages];
      
      if (allUploadedImages.length > 0) {
        setUploadedImages(allUploadedImages);
        const combinedImages = [...memoryImages, ...allUploadedImages];
        setAllImages(combinedImages);
      } else {
        setAllImages(memoryImages);
      }
    } catch (error) {
      Logger.error('Error loading auth state', error);
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

  // IndexedDB helper functions for large image storage
  const openImageDB = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('MemoryStorageImages', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('images')) {
          const store = db.createObjectStore('images', { keyPath: 'id' });
          store.createIndex('filename', 'filename', { unique: false });
        }
      };
    });
  };

  const saveImageToIndexedDB = async (imageData: any) => {
    try {
      const db = await openImageDB();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      
      const imageRecord = {
        id: imageData.filename,
        ...imageData,
        savedAt: Date.now()
      };
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(imageRecord);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      Logger.error('IndexedDB save error:', error);
      return false;
    }
  };

  const loadImagesFromIndexedDB = async () => {
    try {
      const db = await openImageDB();
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      
      return new Promise<any[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {

          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      Logger.error('IndexedDB load error:', error);
      return [];
    }
  };

  const deleteImageFromIndexedDB = async (filename: string) => {
    try {
      const db = await openImageDB();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(filename);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      Logger.error('IndexedDB delete error:', error);
      return false;
    }
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

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        await saveUploadedImage(asset);

      } else {

      }
    } catch (error) {
      Logger.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image: ' + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  const saveUploadedImage = async (asset: any) => {
    try {

      // Get file extension safely
      const uriParts = asset.uri.split('.');
      const extension = uriParts.length > 1 ? uriParts[uriParts.length - 1] : 'jpg';
      const filename = `uploaded_${Date.now()}.${extension}`;

      let finalUri = asset.uri;
      let conversionSuccess = false;
      
      if (Platform.OS === 'web') {

        // For web, try to convert to base64 with compression for quota management
        try {

          // Fetch the image
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          
          // Create compressed version using canvas
          const base64Result = await new Promise<string>((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = document.createElement('img') as HTMLImageElement;
            
            img.onload = () => {
              try {
                // Calculate compressed dimensions (max 600px width/height for smaller files)
                const maxSize = 600;
                let { naturalWidth: width, naturalHeight: height } = img;
                
                if (width > maxSize || height > maxSize) {
                  if (width > height) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                  } else {
                    width = (width * maxSize) / height;
                    height = maxSize;
                  }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with heavy compression (0.5 quality)
                const dataURL = canvas.toDataURL('image/jpeg', 0.5);

                // Clean up
                URL.revokeObjectURL(img.src);
                resolve(dataURL);
              } catch (canvasError) {
                Logger.error('Canvas compression error:', canvasError);
                reject(canvasError);
              }
            };
            
            img.onerror = (error) => {
              Logger.error('Image load error:', error);
              reject(error);
            };
            
            // Create object URL from blob for cross-origin safety
            const objectURL = URL.createObjectURL(blob);
            img.src = objectURL;
          });
          
          finalUri = base64Result;
          conversionSuccess = true;

        } catch (conversionError) {
          Logger.error('Base64 conversion failed:', conversionError);

          // Fallback: try direct FileReader without compression
          try {
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            
            // If original image is too large, skip storage and just show in UI
            if (blob.size > 1024 * 1024) { // 1MB limit

              finalUri = asset.uri;
              conversionSuccess = false;
            } else {
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              finalUri = base64;
              conversionSuccess = true;
            }
          } catch (fallbackError) {
            Logger.error('Fallback conversion failed:', fallbackError);
            finalUri = asset.uri;
            conversionSuccess = false;
          }
        }
      } else {

        // Native platform FileSystem logic here
        try {
          const uploadDir = `${FileSystem.documentDirectory}uploaded_images/`;

          const dirInfo = await FileSystem.getInfoAsync(uploadDir);
          if (!dirInfo.exists) {

            await FileSystem.makeDirectoryAsync(uploadDir, { intermediates: true });
          }
          
          const permanentUri = `${uploadDir}${filename}`;
          await FileSystem.copyAsync({ from: asset.uri, to: permanentUri });
          
          const fileInfo = await FileSystem.getInfoAsync(permanentUri);
          if (!fileInfo.exists) {
            throw new Error('Failed to copy image to permanent storage');
          }
          
          finalUri = permanentUri;
          conversionSuccess = true;

        } catch (fsError) {
          Logger.error('FileSystem error:', fsError);
          finalUri = asset.uri;
          conversionSuccess = false;
        }
      }

      const newImage = {
        uri: finalUri,
        width: asset.width,
        height: asset.height,
        filename: filename,
        isUploaded: true,
        originalUri: asset.uri,
        platform: Platform.OS,
        isPersistent: conversionSuccess,
        timestamp: Date.now(),
        sessionOnly: false,
        storageType: 'pending' as 'asyncstorage' | 'indexeddb' | 'session' | 'pending'
      };

      const updatedUploadedImages = [...uploadedImages, newImage];
      const updatedAllImages = [...allImages, newImage];

      setUploadedImages(updatedUploadedImages);
      setAllImages(updatedAllImages);

      let storageSuccess = false;
      const isLargeImage = finalUri.length > 500000; // 500KB threshold
      
      if (conversionSuccess && finalUri.startsWith('data:')) {
        if (Platform.OS === 'web' && isLargeImage) {
          // Use IndexedDB for large images

          storageSuccess = await saveImageToIndexedDB(newImage);
          
          if (storageSuccess) {

            newImage.storageType = 'indexeddb';
          } else {

            newImage.isPersistent = false;
            newImage.sessionOnly = true;
            newImage.storageType = 'session';
          }
        } else {
          // Use AsyncStorage for small images

          const currentAsyncImages = uploadedImages.filter(img => img.storageType !== 'indexeddb');
          const updatedAsyncImages = [...currentAsyncImages, newImage];
          
          try {
            const dataString = JSON.stringify(updatedAsyncImages);
            const dataSize = new Blob([dataString]).size;

            await AsyncStorage.setItem('uploadedImages', dataString);

            storageSuccess = true;
            newImage.storageType = 'asyncstorage';
          } catch (storageError: any) {
            Logger.error('AsyncStorage error:', storageError);
            
            if (storageError.name === 'QuotaExceededError') {

              if (Platform.OS === 'web') {
                storageSuccess = await saveImageToIndexedDB(newImage);
                if (storageSuccess) {
                  newImage.storageType = 'indexeddb';
                } else {
                  newImage.isPersistent = false;
                  newImage.sessionOnly = true;
                  newImage.storageType = 'session';
                }
              }
            }
            
            if (!storageSuccess) {
              Alert.alert(
                'Storage Issues',
                'Could not save image permanently. Image will work for this session only.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      } else {

        newImage.isPersistent = false;
        newImage.sessionOnly = true;
        newImage.storageType = 'session';
      }
      
      const storageMessage = Platform.OS === 'web'
        ? (newImage.storageType === 'indexeddb' 
          ? '🎉 Large image saved to IndexedDB - will persist across refreshes!'
          : newImage.storageType === 'asyncstorage'
          ? '🎉 Image compressed and saved - will persist across refreshes!'
          : '⚠️ Session-only image - will not persist across refreshes')
        : '🎉 Image saved to device storage!';
      
      Alert.alert('Upload Success!', `Image uploaded successfully!\n\n${storageMessage}`);

    } catch (error) {
      Logger.error('=== SAVE UPLOADED IMAGE ERROR ===');
      Logger.error('Error details:', error);
      Alert.alert('Upload Error', 'Failed to save image: ' + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  // Delete image function
  const deleteImage = async (imageIndex: number) => {

    try {
      const imageToDelete = allImages[imageIndex];

      if (!imageToDelete) {
        Alert.alert('Error', 'Image not found');
        return;
      }
      
      if (imageToDelete?.isUploaded) {
        // It's an uploaded image - remove from storage and state

        // Delete from appropriate storage with proper error handling
        if (imageToDelete.storageType === 'indexeddb') {
          const deleteSuccess = await deleteImageFromIndexedDB(imageToDelete.filename);
          if (!deleteSuccess) {
            Logger.error('Failed to delete from IndexedDB:', imageToDelete.filename);
            Alert.alert('Error', 'Failed to delete image from storage');
            return;
          }
        } else if (imageToDelete.storageType === 'asyncstorage') {
          try {
            // Update AsyncStorage (remove only AsyncStorage images)
            const asyncStorageImages = uploadedImages.filter(img => 
              img.storageType === 'asyncstorage' && img.filename !== imageToDelete.filename
            );
            await AsyncStorage.setItem('uploadedImages', JSON.stringify(asyncStorageImages));
            Logger.info('Successfully updated AsyncStorage after deletion');
          } catch (error) {
            Logger.error('Failed to update AsyncStorage:', error);
            Alert.alert('Error', 'Failed to update image storage');
            return;
          }
        } else {
          // Session-only storage, no persistent deletion needed
          Logger.info('Deleting session-only image:', imageToDelete.filename);
        }
        
        // FIXED: Update state with proper synchronization
        const updatedUploadedImages = uploadedImages.filter(img => img.filename !== imageToDelete.filename);
        
        // Remove from allImages and update orientations accordingly
        const updatedAllImages = allImages.filter((_, index) => index !== imageIndex);
        const updatedImageOrientations = imageOrientations.filter((_, index) => index !== imageIndex);
        
        // Update all state atomically to prevent inconsistencies
        setUploadedImages(updatedUploadedImages);
        setAllImages(updatedAllImages);
        setImageOrientations(updatedImageOrientations);
        
        // Reset current image index if it's out of bounds
        setCurrentImageIndex(currentIndex => {
          const maxIndex = updatedAllImages.length - 1;
          if (currentIndex > maxIndex) {
            return Math.max(0, maxIndex);
          }
          return currentIndex;
        });
        
        Alert.alert('Success', 'Uploaded image deleted successfully!');
      } else {
        // It's a memory image - can only hide it (since it's from the auto-generated list)

        Alert.alert(
          'Memory Image', 
          'Memory images cannot be permanently deleted. To remove them, delete the file from assets/images/memmory/ and run "npm run generate-images".',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      Logger.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete image: ' + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  const confirmDelete = (imageIndex: number) => {
    try {
      // Enhanced validation
      if (imageIndex < 0 || imageIndex >= allImages.length) {
        Logger.error('Image index out of bounds:', { imageIndex, allImagesLength: allImages.length });
        Alert.alert('Error', 'Invalid image index. Please refresh the gallery.');
        return;
      }

      const imageToDelete = allImages[imageIndex];

      if (!imageToDelete) {
        Logger.error('No image found at index:', imageIndex);
        Alert.alert('Error', `No image found at index ${imageIndex}. Please refresh the gallery.`);
        return;
      }
      
      const isUploaded = imageToDelete?.isUploaded;
      const imageType = isUploaded ? 'uploaded' : 'memory';
      const storageInfo = isUploaded ? ` (${imageToDelete.storageType})` : '';

      // Show confirmation dialog for better UX
      Alert.alert(
        'Delete Image',
        `Are you sure you want to delete this ${imageType} image${storageInfo}?${
          isUploaded ? '' : '\n\nNote: Memory images will only be hidden. To permanently remove them, delete from assets/images/memmory/ folder.'
        }`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteImage(imageIndex);
              } catch (error) {
                Logger.error('Error during deletion:', error);
                Alert.alert('Error', 'Failed to delete image: ' + String(error));
              }
            }
          }
        ]
      );
    } catch (error) {
      Logger.error('Error in confirmDelete:', error);
      Alert.alert('Error', 'Confirm delete error: ' + String(error));
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
  
  // Initialize app sequence
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Show loading for 2 seconds

        // Load auth state and images
        await loadAuthState();
        
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        setShowChallenge(true);
      } catch (error) {
        Logger.error('App initialization error:', error);
        setIsLoading(false);
        setShowChallenge(true);
      }
    };
    
    initializeApp();
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
  const filteredImages = allImages
    .map((image, originalIndex) => ({ ...image, originalIndex })) // Preserve original index
    .filter((image, index) => {
      if (imageFilter === 'all') return true;
      if (imageOrientations.length === 0) return true; // Show all if orientations not detected yet
      return imageOrientations[image.originalIndex] === imageFilter;
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
    // FIXED: Use the originalIndex preserved during filtering
    const originalIndex = item.originalIndex;
    
    // Validate that originalIndex exists
    if (originalIndex === undefined || originalIndex < 0 || originalIndex >= allImages.length) {
      Logger.error('Invalid originalIndex in renderImageItem', {
        originalIndex,
        filteredIndex: index,
        allImagesLength: allImages.length,
        item: { filename: item?.filename, uri: item?.uri }
      });
      return null; // Skip rendering this item
    }
    
    // Use the original index for orientation detection
    const imageOrientation = imageOrientations[originalIndex] || 'horizontal';

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

    return (
      <ThemedView style={[containerStyle, { position: 'relative', overflow: 'visible' }]}>
        <ThemedView style={{ position: 'relative', flex: 1, width: '100%', height: '100%' }}>
          <ImageWithTightBorder
            source={item.isUploaded ? { uri: item.uri } : (item || require('@/assets/images/sun_kastl.jpg'))} // Handle uploaded images
            orientation={imageOrientation}
            isLargeScreen={isLargeScreen}
            containerStyle={{ flex: 1, width: '100%', height: '100%' }}
            onImageLoad={(event) => {

              handleImageLoad(originalIndex, event);
            }}
          />
          
          {/* Delete button - only visible when logged in */}
          {isLoggedIn && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: '#FF0000',
                borderRadius: 25,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 8,
                zIndex: 9999,
                borderWidth: 3,
                borderColor: 'white',
              }}
              onPress={(e) => {
                e.stopPropagation();
                e.preventDefault();

                try {
                  // Add haptic feedback for better user experience
                  if (Platform.OS === 'ios' || Platform.OS === 'android') {
                    // Import needed for haptic feedback
                    import('expo-haptics').then(Haptics => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }).catch(() => {
                      // Haptics not available, continue without it
                    });
                  }

                  // Enhanced validation with better error messaging
                  if (originalIndex === -1 || originalIndex === undefined || originalIndex === null) {
                    Logger.error('Invalid originalIndex:', { 
                      originalIndex, 
                      filteredIndex: index,
                      itemFilename: item?.filename,
                      allImagesLength: allImages.length 
                    });
                    Alert.alert('Error', 'Could not find image to delete. Please try refreshing the gallery.');
                    return;
                  }

                  // Ensure we're within bounds
                  if (originalIndex >= allImages.length || originalIndex < 0) {
                    Logger.error('originalIndex out of bounds:', { 
                      originalIndex, 
                      allImagesLength: allImages.length 
                    });
                    Alert.alert('Error', 'Image index is out of range. Please refresh the gallery.');
                    return;
                  }

                  // Enhanced logging for debugging
                  Logger.info('Delete button pressed:', {
                    originalIndex,
                    filteredIndex: index,
                    filename: item?.filename,
                    isUploaded: item?.isUploaded,
                    storageType: item?.storageType
                  });

                  // Direct call to confirmDelete
                  confirmDelete(originalIndex);
                  
                } catch (error) {
                  Logger.error('Error in delete button handler:', error);
                  Alert.alert('Error', 'Delete button error: ' + String(error));
                }
              }}
              activeOpacity={0.8}
            >
              <ThemedText style={{ 
                color: 'white', 
                fontSize: 20, 
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: 22
              }}>
                ✕
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
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
        // Target reached! Clear timeout and complete challenge
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setClickCount(0);
        setFirstClickTime(null);
        setChallengeCompleted(true);
        setShowChallenge(false);
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
      {/* Loading Screen */}
      {isLoading && (
        <Modal
          visible={true}
          animationType="fade"
          transparent={false}
          statusBarTranslucent={true}
        >
          <ThemedView style={[PopupStyles.popupContainer, { backgroundColor: '#000' }]}>
            <ThemedView style={PopupStyles.popupContent}>
              <ThemedText type="title" style={[PopupStyles.popupTitle, { color: '#fff' }]}>
                💾 Memory Storage
              </ThemedText>
              
              <ThemedText style={[PopupStyles.popupSubtitle, { color: '#ccc' }]}>
                Loading your memories...
              </ThemedText>
              
              <ThemedView style={{ marginTop: 40, alignItems: 'center' }}>
                <ThemedText style={{ color: '#fff', fontSize: 40 }}>⏳</ThemedText>
                <ThemedText style={{ color: '#888', marginTop: 20 }}>
                  Please wait while we prepare your gallery
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
      )}

      {/* Challenge Screen */}
      {showChallenge && !challengeCompleted && (
        <Modal
          visible={true}
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
                    Tap the heart 15 times in 5 seconds to start the challenge!
                  </ThemedText>
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
      )}

      {/* Main App Content (only visible after challenge is completed) */}
      {challengeCompleted && (
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
              padding: 10,
              margin: 10,
              borderRadius: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }}>
              <ThemedView style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
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
      )}
    </>
  );
}
