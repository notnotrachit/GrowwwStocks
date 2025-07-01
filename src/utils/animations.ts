import { Animated, Easing } from 'react-native';

export const animationConfig = {
  // Standard durations
  fast: 200,
  medium: 300,
  slow: 500,
  
  // Easing curves
  easeInOut: Easing.inOut(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  spring: Easing.elastic(1),
  bounce: Easing.bounce,
};

// Fade in animation
export const createFadeInAnimation = (
  animatedValue: Animated.Value,
  duration: number = animationConfig.medium,
  delay: number = 0
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: animationConfig.easeOut,
    useNativeDriver: true,
  });
};

// Scale animation
export const createScaleAnimation = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  duration: number = animationConfig.medium
) => {
  return Animated.spring(animatedValue, {
    toValue,
    duration,
    useNativeDriver: true,
  });
};

// Slide in from bottom
export const createSlideInAnimation = (
  animatedValue: Animated.Value,
  duration: number = animationConfig.medium
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: animationConfig.easeOut,
    useNativeDriver: true,
  });
};

// Staggered animation for lists
export const createStaggeredAnimation = (
  animations: Animated.CompositeAnimation[],
  delay: number = 100
) => {
  return Animated.stagger(delay, animations);
};

// Pulse animation
export const createPulseAnimation = (
  animatedValue: Animated.Value,
  minValue: number = 0.95,
  maxValue: number = 1.05,
  duration: number = 1000
) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: duration / 2,
        easing: animationConfig.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: duration / 2,
        easing: animationConfig.easeInOut,
        useNativeDriver: true,
      }),
    ])
  );
};

// Shimmer animation for loading states
export const createShimmerAnimation = (
  animatedValue: Animated.Value,
  duration: number = 1500
) => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

// Bounce in animation
export const createBounceInAnimation = (
  animatedValue: Animated.Value,
  duration: number = animationConfig.slow
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: animationConfig.bounce,
    useNativeDriver: true,
  });
};

// Press animation
export const createPressAnimation = (
  animatedValue: Animated.Value,
  pressedScale: number = 0.95,
  duration: number = animationConfig.fast
) => {
  return {
    pressIn: Animated.timing(animatedValue, {
      toValue: pressedScale,
      duration,
      useNativeDriver: true,
    }),
    pressOut: Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }),
  };
};

// Modal slide animation
export const createModalSlideAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = animationConfig.medium
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: animationConfig.easeOut,
    useNativeDriver: true,
  });
};

// Backdrop fade animation
export const createBackdropFadeAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = animationConfig.medium
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: animationConfig.easeOut,
    useNativeDriver: false, // backgroundColor animations can't use native driver
  });
};

// Rotation animation
export const createRotationAnimation = (
  animatedValue: Animated.Value,
  duration: number = animationConfig.medium
) => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

// Card flip animation
export const createFlipAnimation = (
  animatedValue: Animated.Value,
  duration: number = animationConfig.medium
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: animationConfig.easeInOut,
    useNativeDriver: true,
  });
};

// Elastic animation
export const createElasticAnimation = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  duration: number = animationConfig.slow
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: animationConfig.spring,
    useNativeDriver: true,
  });
};

// Complex list item entrance animation
export const createListItemEntranceAnimation = (
  fadeValue: Animated.Value,
  slideValue: Animated.Value,
  index: number = 0,
  duration: number = animationConfig.medium
) => {
  const delay = index * 50; // Stagger delay
  
  return Animated.parallel([
    Animated.timing(fadeValue, {
      toValue: 1,
      duration,
      delay,
      easing: animationConfig.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(slideValue, {
      toValue: 0,
      duration,
      delay,
      easing: animationConfig.easeOut,
      useNativeDriver: true,
    }),
  ]);
};
