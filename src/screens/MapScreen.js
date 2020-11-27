import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import styles from 'src/styles/Styles.js';
import auth from '@react-native-firebase/auth';

const MapScreen: () => React$Node = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState();

  return (
    <View style={styles.container}>
      <Text>Map View</Text>
      <Button
        title="Sign Out"
        onPress={() => {
          auth()
            .signOut()
            .then(() => setCurrentUser(null));
        }}
      />
    </View>
  );
};

export default MapScreen;
