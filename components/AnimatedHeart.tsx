import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AnimatedHeartProps {
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  clickCount?: number;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  size = 24,
  color = '#FF1493',
  onPress,
  style,
  activeOpacity = 0.7,
  clickCount = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Dynamic color based on click intensity
  const getHeartColor = () => {
    if (clickCount === 0) return color;
    if (clickCount < 3) return '#FF1493'; // Deep pink
    if (clickCount < 6) return '#FF69B4'; // Hot pink
    if (clickCount < 8) return '#FF6347'; // Tomato red
    return '#FF0000'; // Bright red for intense clicking
  };

  // Base pulse animation that triggers on every click
  useEffect(() => {
    if (clickCount > 0) {
      // Calculate pulse intensity based on click frequency
      const pulseIntensity = Math.min(1 + (clickCount * 0.15), 2.5); // Max 2.5x scale for more dramatic effect
      const animationSpeed = Math.max(100, 200 - (clickCount * 1)); // Faster animation with more clicks
      
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: pulseIntensity,
          duration: animationSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: animationSpeed,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [clickCount]);

  // Press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const combinedScale = Animated.multiply(scaleAnim, pulseAnim);

  // Custom heart SVG path
  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={activeOpacity}
      style={style}
    >
      <Animated.View
        style={{
          transform: [{ scale: combinedScale }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d={heartPath}
            fill={getHeartColor()}
            stroke={getHeartColor()}
            strokeWidth="0.5"
          />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedHeart;
