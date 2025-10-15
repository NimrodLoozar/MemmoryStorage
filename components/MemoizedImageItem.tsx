import { ImageWithTightBorder } from '@/components/ImageWithTightBorder';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GalleryStyles } from '@/styles';
import Logger from '@/utils/logger';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';

interface MemoizedImageItemProps {
  item: any;
  index: number;
  allImages: any[];
  imageOrientations: string[];
  isLargeScreen: boolean;
  imageItemWidth: number;
  isLoggedIn: boolean;
  MEMORY_IMAGE_COUNT: number;
  onDeleteImage: (originalIndex: number) => void;
  onShowMemoryImageInfo: () => void;
  onImageLoad: (originalIndex: number, event: any) => void;
}

// Memoized image item component for optimal performance
export const MemoizedImageItem = memo<MemoizedImageItemProps>(({
  item,
  index,
  allImages,
  imageOrientations,
  isLargeScreen,
  imageItemWidth,
  isLoggedIn,
  MEMORY_IMAGE_COUNT,
  onDeleteImage,
  onShowMemoryImageInfo,
  onImageLoad
}) => {
  // FIXED: Use the originalIndex preserved during filtering
  const originalIndex = item.originalIndex;
  
  // Validate that originalIndex exists
  if (originalIndex === undefined || originalIndex < 0 || originalIndex >= allImages.length) {
    Logger.error('Invalid originalIndex in MemoizedImageItem', {
      originalIndex,
      filteredIndex: index,
      allImagesLength: allImages.length,
      item: { filename: item?.filename, uri: item?.uri }
    });
    return null; // Skip rendering this item
  }
  
  // Use the original index for orientation detection
  const imageOrientation = (imageOrientations[originalIndex] || 'horizontal') as 'horizontal' | 'vertical';

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
          source={item.isUploaded ? { uri: item.uri } : (item || require('@/assets/images/sun_kastl.jpg'))}
          orientation={imageOrientation}
          isLargeScreen={isLargeScreen}
          containerStyle={{ flex: 1, width: '100%', height: '100%' }}
          onImageLoad={(event) => onImageLoad(originalIndex, event)}
        />
        
        {/* Delete button for uploaded images when logged in */}
        {isLoggedIn && originalIndex >= MEMORY_IMAGE_COUNT && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#fff',
              zIndex: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            onPress={() => onDeleteImage(originalIndex)}
            activeOpacity={0.7}
          >
            <ThemedText style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 22
            }}>
              ✕
            </ThemedText>
          </TouchableOpacity>
        )}
        
        {/* Info button for memory images when logged in */}
        {isLoggedIn && originalIndex < MEMORY_IMAGE_COUNT && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(0, 122, 255, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#fff',
              zIndex: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            onPress={onShowMemoryImageInfo}
            activeOpacity={0.7}
          >
            <ThemedText style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 22
            }}>
              ℹ
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo optimization
  return (
    prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.isLargeScreen === nextProps.isLargeScreen &&
    prevProps.imageItemWidth === nextProps.imageItemWidth &&
    prevProps.isLoggedIn === nextProps.isLoggedIn &&
    prevProps.imageOrientations === nextProps.imageOrientations
  );
});