import React, {useState} from 'react';
import {View, StatusBar, Button, TextInput, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import styles from 'src/styles/Styles.js';

function PhoneSignIn() {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  async function signInWithPhoneNumber() {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      Alert.alert('Invalid code!');
    }
  }

  if (!confirm) {
    return (
      <View>
        <TextInput
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <Button
          title="Sign In With Phone Number"
          onPress={() => {
            signInWithPhoneNumber();
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <TextInput value={code} onChangeText={(text) => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </View>
  );
}

const SignInScreen: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <PhoneSignIn />
      <StatusBar style="auto" />
    </View>
  );
};

export default SignInScreen;
