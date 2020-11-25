import React from 'react';
import {View} from 'react-native';
import styles from 'src/styles/Styles.js';
import SignInScreen from 'src/screens/SignInScreen.js';

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <SignInScreen />
    </View>
  );
};

export default App;
