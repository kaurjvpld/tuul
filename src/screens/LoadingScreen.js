import React from 'react';
import {View, Text} from 'react-native';
import styles from 'src/styles/Styles.js';

const LoadingScreen: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <Text>Loading..</Text>
    </View>
  );
};

export default LoadingScreen;
