import React, {useEffect, useState} from 'react';
import SignInScreen from 'src/screens/SignInScreen.js';
import MapScreen from 'src/screens/MapScreen.js';
import RegisterVehicleScreen from 'src/screens/RegisterVehicleScreen.js';
import auth from '@react-native-firebase/auth';

const App: () => React$Node = () => {
  const [user, setUser] = useState();

  function onAuthStateChanged(_user) {
    setUser(_user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (user) {
    if (user.vehicle) {
      return <MapScreen />;
    } else {
      return <RegisterVehicleScreen />;
    }
  }

  return <SignInScreen />;
};

export default App;
