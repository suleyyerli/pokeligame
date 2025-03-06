import React, { useEffect } from "react";
import { Animated, ImageSourcePropType, StyleSheet } from "react-native";

interface BounceAnimationProps {
  source: ImageSourcePropType;
  size?: number;
  duration?: number;
  bounceHeight?: number;
  style?: any;
}

export const BounceAnimation: React.FC<BounceAnimationProps> = ({
  source,
  size = 20,
  duration = 1500,
  bounceHeight = 10,
  style,
}) => {
  const bounceValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -bounceHeight,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceHeight, duration]);

  return (
    <Animated.Image
      source={source}
      style={[
        {
          width: size,
          height: size,
          transform: [{ translateY: bounceValue }],
        },
        style,
      ]}
    />
  );
};
