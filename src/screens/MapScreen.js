import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const MapScreen: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
