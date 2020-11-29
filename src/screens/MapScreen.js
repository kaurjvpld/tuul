import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const MapScreen: () => React$Node = () => {
  const [mapCenter, setMapCenter] = useState({lat: 59.43699, lng: 24.753468});
  const [userLocation, setUserLocation] = useState({
    lat: 59.43699,
    lng: 24.753468,
  });
  const [markers, setMarkers] = useState([]);

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }

  useEffect(() => {
    requestLocationPermission();

    function updateMarkerIfPresent(markerToUpdate) {
      let updateHappened = false;
      let newMarkers = markers.map((marker) => {
        if (marker.id === markerToUpdate.id) {
          updateHappened = true;
          return {...marker, position: markerToUpdate.position};
        } else {
          return marker;
        }
      });
      setMarkers(newMarkers);
      return updateHappened;
    }

    let userGeolocationUpdaterInterval = setInterval(
      () =>
        Geolocation.getCurrentPosition(
          (position) => {
            let userMarker = {
              title: 'Your Location',
              position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              url: require('src/assets/bluedot.png'),
            };
            if (!updateMarkerIfPresent(userMarker)) {
              setMarkers([...markers, userMarker]);
              // this.mapCenter = userMarker.position;
            }
            setUserLocation(userMarker.position);
          },
          (error) => {
            console.log(error.code, error.message);
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 10000,
          },
        ),
      1000,
    );

    setMapCenter(userLocation);

    return () => {
      clearInterval(userGeolocationUpdaterInterval);
    };
  }, [markers, userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.position.lat,
              longitude: marker.position.lng,
            }}
            title={'Your Location'}>
            <Image source={marker.url} />
          </Marker>
        ))}
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
