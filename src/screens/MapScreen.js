import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';

const MapScreen: () => React$Node = ({vehicleId}) => {
  const [userLocation, setUserLocation] = useState(undefined);
  const [vehicle, setVehicle] = useState(undefined);
  const mapView = useRef(null);

  function goToUserLocation() {
    mapView.current.animateToRegion(
      {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      500,
    );
  }

  function goToVehicleLocation() {
    mapView.current.animateToRegion(
      {
        latitude: vehicle.location.lat,
        longitude: vehicle.location.lon,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      500,
    );
  }

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }

  function getUserLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      },
    );
  }

  useEffect(() => {
    requestLocationPermission();
    getUserLocation();
    const unsubscribeVehicleQuery = firestore()
      .collection('vehicles')
      .doc(vehicleId)
      .onSnapshot((vehicleSnapshot) => {
        if (!vehicleSnapshot) {
          console.log('Vehicle not found');
        } else {
          setVehicle(vehicleSnapshot.data());
        }
      });
    return () => {
      unsubscribeVehicleQuery();
    };
  }, [vehicleId]);

  return (
    <View style={styles.container}>
      {userLocation && vehicle && (
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            }}
            title={'Your Location'}>
            <Image source={require('src/assets/bluedot.png')} />
          </Marker>
          <Marker
            coordinate={{
              latitude: vehicle.location.lat,
              longitude: vehicle.location.lon,
            }}
            title={'Vehicle Location'}>
            <Image source={require('src/assets/ic_battery_100.png')} />
          </Marker>
        </MapView>
      )}
      <View>
        <Button title="Sign Out" onPress={() => auth().signOut()} />
      </View>
      <TouchableOpacity
        style={styles.scooterLocation}
        onPress={() => goToVehicleLocation()}>
        <Icon name="electric-scooter" style={styles.buttonLight} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.userLocation}
        onPress={() => goToUserLocation()}>
        <Icon name="gps-fixed" style={styles.buttonLight} />
      </TouchableOpacity>
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
  scooterLocation: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  userLocation: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  buttonLight: {
    backgroundColor: '#ffffff',
    padding: 8,
  },
});
