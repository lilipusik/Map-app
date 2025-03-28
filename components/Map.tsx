import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MarkerData } from '../utils/types';
import { getAddress } from '../services/address';
import { MapProps } from '../utils/props';
import * as Location from 'expo-location';
import userLocationIcon from '../assets/user-location.png';

export default function Map({ markers, onMarkerPress, onMapReady, onError, onAddMarker, userLocation }: MapProps 
  & { userLocation: Location.LocationObject | null }) {
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isMapReady) {
        onError('Не удалось загрузить карту. Пожалуйста, проверьте подключение к интернету.');
      }
      
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isMapReady]);

  const handleLongPress = async (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const address = await getAddress(latitude, longitude);
      const newMarker: MarkerData = {
        latitude,
        longitude,
        title: `Маркер ${markers.length + 1}`,
        description: '',
        address: address,
      };

      onAddMarker(newMarker);
    } catch (error) {
      console.error('Ошибка при получении адреса:', error);
    }
  };

  const handleMapReady = () => {
    setIsMapReady(true);
    onMapReady();
  };

  const handleFocusOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 58.000000,
          longitude: 56.3,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        onLongPress={handleLongPress}
        onMapReady={handleMapReady}
        // геолокация вообще делаяется так, но по заданию видимо надо херней страдать
        // showsUserLocation={true}
        // followsUserLocation={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            pinColor='#a49bd4'
            title={marker.title}
            onPress={() => onMarkerPress(marker)}
          />
        ))}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            icon={userLocationIcon}
            title="Ваше местоположение"
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.locationButton} onPress={handleFocusOnUserLocation}>
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#a49bd4',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});