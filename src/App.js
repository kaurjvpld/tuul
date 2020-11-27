import React, {useEffect, useState} from 'react';
import SignInScreen from 'src/screens/SignInScreen.js';
import MapScreen from 'src/screens/MapScreen.js';
import RegisterVehicleScreen from 'src/screens/RegisterVehicleScreen.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const App: () => React$Node = () => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    let unsubscribeUserListener = null;
    const unsubscribeAuthStateListener = auth().onAuthStateChanged((user) => {
      let _isLoggedIn = !!(user || {}).uid;
      setIsLoggedIn(_isLoggedIn);

      if (_isLoggedIn) {
        unsubscribeUserListener = firestore()
          .collection('users')
          .doc(user.uid)
          .onSnapshot((userSnapshot) => {
            console.log(JSON.stringify(userSnapshot.data()));
            setCurrentUser({
              id: userSnapshot.id,
              ...userSnapshot.data(),
            });
          });
      } else {
        setCurrentUser(null);
      }
    });
    return () => {
      unsubscribeAuthStateListener();
      if (unsubscribeUserListener) {
        unsubscribeUserListener();
      }
    };
  }, [isLoggedIn]);

  if (currentUser) {
    if (currentUser.vehicle) {
      return <MapScreen />;
    } else {
      return <RegisterVehicleScreen />;
    }
  }

  return <SignInScreen />;
};

export default App;
