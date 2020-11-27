import React, {useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import commonStyles from 'src/styles/Styles.js';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const RegisterVehicleScreen: () => React$Node = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState();
  const [code, setCode] = useState('');

  async function pairVehicle() {
    let authToken = await auth().currentUser.getIdToken();

    try {
      let response = await axios.post(
        `https://us-central1-coscooter-eu.cloudfunctions.net/pair?apiKey=${authToken}`,
        {vehicleCode: code},
      );

      if (response.status !== 200 && response.status !== 204) {
        console.log('something went wrong!');
      } else {
        console.log('all good!');
      }
    } catch (e) {
      console.log('There is an error!', e);
    }
  }

  return (
    <View style={commonStyles.container}>
      <Text>Register Vehicle</Text>
      <TextInput value={code} onChangeText={(text) => setCode(text)} />
      <Button
        title="Pair"
        onPress={() => {
          pairVehicle();
        }}
      />
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

export default RegisterVehicleScreen;
