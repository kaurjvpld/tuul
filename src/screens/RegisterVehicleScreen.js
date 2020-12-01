import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import QRCodeScanner from 'react-native-qrcode-scanner';

const RegisterVehicleScreen: () => React$Node = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState();
  const [vehicleCode, setVehicleCode] = useState('');

  async function pairVehicle(_code) {
    let authToken = await auth().currentUser.getIdToken();

    try {
      await axios.post(
        `https://us-central1-coscooter-eu.cloudfunctions.net/pair?apiKey=${authToken}`,
        {vehicleCode: _code},
      );
    } catch (error) {
      Alert.alert('Something went wrong when pairing vehicle..');
      console.log(error.message);
    }
  }

  const onSuccess = (_code) => {
    pairVehicle(_code.data);
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      topContent={
        <Text style={styles.centerText}>Scan QR or enter code manually</Text>
      }
      bottomContent={
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>code</Text>
          <TextInput
            placeholder="Insert code & click Pair"
            onChangeText={(_code) => setVehicleCode(_code)}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.suffix}
            onPress={() => pairVehicle(vehicleCode)}>
            <Text style={styles.suffixText}>Pair</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default RegisterVehicleScreen;

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 40,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 10,
    width: '100%',
    marginTop: 60,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    width: '60%',
    borderColor: '#ced4da',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  prefix: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#495057',
    borderWidth: 1,
    borderColor: '#ced4da',
    width: '20%',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#e9ecef',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  suffix: {
    borderWidth: 1,
    borderColor: '#28a745',
    width: '20%',
    justifyContent: 'center',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  suffixText: {
    fontWeight: 'bold',
    fontSize: 18,

    color: '#28a745',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
