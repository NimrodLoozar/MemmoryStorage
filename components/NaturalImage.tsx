// Example usage of natural aspect ratio image display
// This component shows how to display images maintaining their original orientation

import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { MainStyles } from '@/styles';

interface NaturalImageProps {
  source: any;
  isLargeScreen?: boolean;
}

export const NaturalImage: React.FC<NaturalImageProps> = ({ source, isLargeScreen = false }) => {
  return (
    <View style={MainStyles.naturalImageContainer}>
      <Image
        source={source}
        style={[
          MainStyles.naturalImage,
          isLargeScreen ? MainStyles.naturalImageDesktop : MainStyles.naturalImageMobile
        ]}
        // No contentFit - let image size itself naturally within max constraints
      />
    </View>
  );
};

// Alternative approach using proper dimensions with aspect ratio preservation
export const AutoSizedImage: React.FC<NaturalImageProps> = ({ source, isLargeScreen = false }) => {
  return (
    <View style={MainStyles.naturalImageContainer}>
      <Image
        source={source}
        style={[
          {
            // Image sizes itself naturally with max constraints
            maxWidth: isLargeScreen ? '70%' : '90%',
            maxHeight: isLargeScreen ? 500 : 350,
            borderRadius: 15,
            borderWidth: 2,
            borderColor: 'rgba(255, 20, 147, 0.3)',
          }
        ]}
        // No contentFit - natural sizing
        placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }} // Optional blur placeholder
        transition={200} // Smooth transition when loading
      />
    </View>
  );
};
