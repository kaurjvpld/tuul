import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import styles from 'src/styles/Styles.js';
import auth from '@react-native-firebase/auth';

const RegisterVehicleScreen: () => React$Node = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState();

  return (
    <View style={styles.container}>
      <Text>Register Vehicle</Text>
      <Button
        title="Sign Out"
        onPress={() => {
          auth()
            .signOut()
            .then(() => setUser(null));
        }}
      />
    </View>
  );
};

export default RegisterVehicleScreen;
