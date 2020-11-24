import React from 'react';
import {View, Text} from 'react-native';
import styles from 'src/styles/Styles.js';

const App: () => React$Node = () => {
  return (
    <>
      <View style={styles.container}>
        <Text>Hello World!</Text>
      </View>
    </>
  );
};

export default App;
