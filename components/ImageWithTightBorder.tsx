import { GalleryStyles } from '@/styles';
import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

interface ImageWithTightBorderProps {
  source: any;
  orientation: 'horizontal' | 'vertical';
  isLargeScreen: boolean;
  style?: any;
  containerStyle?: any;
  onImageLoad?: (event: any) => void;
}

export const ImageWithTightBorder: React.FC<ImageWithTightBorderProps> = ({
  source,
  orientation,
  isLargeScreen,
  style,
  containerStyle,
  onImageLoad
}) => {
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{width: number, height: number} | null>(null);

  // Handle image load to get natural dimensions
  const handleImageLoad = useCallback((event: any) => {
    const { source: imageSource } = event;
    if (imageSource && imageSource.width && imageSource.height) {
      setImageDimensions({
        width: imageSource.width,
        height: imageSource.height
      });
      
      // Call the parent's onImageLoad callback if provided
      if (onImageLoad) {
        onImageLoad(event);
      }
    }
  }, [onImageLoad]);

  // Handle container layout to get available space
  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  }, []);

  // Calculate the actual display dimensions that maintain aspect ratio
  const getDisplayDimensions = () => {
    if (!imageDimensions || !containerDimensions) return null;

    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    
    // Get max dimensions based on orientation and screen size
    let maxWidth, maxHeight;
    
    if (orientation === 'horizontal') {
      if (isLargeScreen) {
        maxWidth = containerDimensions.width * 0.85; // Increased from 0.8
        maxHeight = 480; // Increased from 420 for bigger images
      } else {
        maxWidth = containerDimensions.width * 0.99; // Increased from 0.98
        maxHeight = 400; // Increased from 340 for bigger images
      }
    } else {
      if (isLargeScreen) {
        maxWidth = containerDimensions.width * 0.65; // Increased from 0.6
        maxHeight = 480; // Increased from 420 for bigger images
      } else {
        maxWidth = containerDimensions.width * 0.95; // Increased from 0.9
        maxHeight = 400; // Increased from 340 for bigger images
      }
    }

    // Calculate dimensions that fit within max bounds while maintaining aspect ratio
    let displayWidth = maxWidth;
    let displayHeight = displayWidth / imageAspectRatio;

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * imageAspectRatio;
    }

    return { width: displayWidth, height: displayHeight };
  };

  const displayDimensions = getDisplayDimensions();

  // Get wrapper style based on orientation and screen size
  const getWrapperStyle = () => {
    const baseStyle = [
      GalleryStyles.imageWithBorderWrapper,
      isLargeScreen && GalleryStyles.imageWithBorderWrapperDesktop
    ];

    if (displayDimensions) {
      return [
        ...baseStyle,
        {
          width: displayDimensions.width,
          height: displayDimensions.height,
        }
      ];
    }

    // Fallback style while dimensions are being calculated
    const orientationStyle = orientation === 'horizontal' 
      ? (isLargeScreen ? GalleryStyles.horizontalImageWrapperDesktop : GalleryStyles.horizontalImageWrapperMobile)
      : (isLargeScreen ? GalleryStyles.verticalImageWrapperDesktop : GalleryStyles.verticalImageWrapperMobile);

    return [...baseStyle, orientationStyle];
  };

  return (
    <View 
      style={[
        containerStyle,
        {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }
      ]} 
      onLayout={handleContainerLayout}
    >
      {containerDimensions && (
        <View style={getWrapperStyle()}>
          <Image
            source={source}
            style={[GalleryStyles.imageWithTightBorder, style]}
            contentFit="cover" // Use cover to fill the border area completely
            transition={200}
            placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
            onLoad={handleImageLoad}
          />
        </View>
      )}
    </View>
  );
};