import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const MapScreen: () => React$Node = () => {
  const [mapCenter, setMapCenter] = useState({lat: 59.43699, lng: 24.753468});

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }

  function getGeoLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        let _position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(_position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 10000,
      },
    );
  }

  useEffect(() => {
    requestLocationPermission();
    getGeoLocation();
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        style={styles.map}
        region={{
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <MapView.Marker
          coordinate={{
            latitude: mapCenter.lat,
            longitude: mapCenter.lng,
          }}
          title={'Your Location'}
          draggable
        />
      </MapView>
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
