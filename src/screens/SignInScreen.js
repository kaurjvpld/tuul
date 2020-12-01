import React, {useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import commonStyles from 'src/styles/Styles.js';
import Loading from 'src/screens/LoadingScreen.js';

function PhoneSignIn() {
  const [confirm, setConfirm] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const countryCode = '+372';

  async function signInWithPhoneNumber() {
    setLoading(true);
    let confirmation = null;

    try {
      confirmation = await auth().signInWithPhoneNumber(
        countryCode + phoneNumber,
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Could not send confirmation code..');
    }

    setLoading(false);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    setLoading(true);

    try {
      await confirm.confirm(confirmationCode);
    } catch (error) {
      setLoading(false);
      Alert.alert('Invalid code!');
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!confirm) {
    return (
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>{countryCode}</Text>
          <TextInput
            keyboardType="number-pad"
            value={phoneNumber}
            onChangeText={(number) => setPhoneNumber(number)}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={() => signInWithPhoneNumber()}>
          <Text style={styles.button}>SIGN IN WITH PHONE NUMBER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <TextInput
        style={styles.confirmCodeInput}
        value={confirmationCode}
        keyboardType="number-pad"
        onChangeText={(text) => setConfirmationCode(text)}
      />
      <TouchableOpacity onPress={() => confirmCode()}>
        <Text style={styles.button}>CONFIRM CODE</Text>
      </TouchableOpacity>
    </View>
  );
}

const SignInScreen: () => React$Node = () => {
  return (
    <View style={commonStyles.container}>
      <PhoneSignIn />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  confirmCodeInput: {
    borderBottomWidth: 3,
    marginBottom: 30,
    fontWeight: 'bold',
    fontSize: 30,
  },
  input: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  button: {
    color: 'white',
    paddingTop: 15,
    paddingRight: 18,
    paddingBottom: 15,
    paddingLeft: 18,
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 123, 255, 1)',
  },
  inputContainer: {
    borderBottomWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  prefix: {
    paddingRight: 10,
    fontWeight: 'bold',
    fontSize: 30,
    color: '#858585',
  },
});
