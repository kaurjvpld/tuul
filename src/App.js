import React from 'react';
import {View} from 'react-native';
import styles from 'src/styles/Styles.js';
import SignIn from 'src/screens/SignIn.js';

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <SignIn />
    </View>
  );
};

export default App;
