import React, { useEffect } from "react";
import { Animated, ImageSourcePropType, StyleSheet } from "react-native";

interface SpinAnimationProps {
  source: ImageSourcePropType;
  size?: number;
  duration?: number;
  style?: any;
}

export const SpinAnimation: React.FC<SpinAnimationProps> = ({
  source,
  size = 20,
  duration = 2000,
  style,
}) => {
  const rotation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      })
    ).start();
  }, [duration]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.Image
      source={source}
      style={[
        {
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        },
        style,
      ]}
    />
  );
};
