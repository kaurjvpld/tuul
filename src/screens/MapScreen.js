import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import VehicleDetailsBar from 'src/components/VehicleDetailsBar.js';
import Loading from 'src/screens/LoadingScreen.js';

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
          Alert.alert('Vehicle not found..');
        } else {
          setVehicle({...vehicleSnapshot.data(), id: vehicleId});
        }
      });
    return () => {
      unsubscribeVehicleQuery();
    };
  }, [vehicleId]);

  if (userLocation && vehicle) {
    return (
      <View style={styles.container}>
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
        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={() => auth().signOut()}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
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
        <VehicleDetailsBar vehicle={vehicle} />
      </View>
    );
  }

  return <Loading />;
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
    bottom: '33%',
    right: '5%',
  },
  userLocation: {
    position: 'absolute',
    bottom: '26%',
    right: '5%',
  },
  buttonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 6,
  },
  logoutContainer: {
    position: 'absolute',
    top: '3%',
    left: '5%',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    borderRadius: 6,
  },
});
