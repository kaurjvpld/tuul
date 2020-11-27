import React from 'react';
import {View, Text} from 'react-native';
import commonStyles from 'src/styles/Styles.js';

const LoadingScreen: () => React$Node = () => {
  return (
    <View style={commonStyles.container}>
      <Text>Loading..</Text>
    </View>
  );
};

export default LoadingScreen;
