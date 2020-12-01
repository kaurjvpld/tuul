import React from 'react';
import {StyleSheet} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

const LoadingScreen: () => React$Node = () => {
  return (
    <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={require('src/assets/loader.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});
