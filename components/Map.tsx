import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { MarkerData } from '../utils/types';
import { getAddress } from '../utils/address';
import { MapProps } from '../utils/props';

export default function Map({ markers, onMarkerPress, onMapReady, onError, onAddMarker }: MapProps) {
  const [isMapReady, setIsMapReady] = useState(false);

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
        id: uuidv4(),
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 58.000000,
          longitude: 56.3,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0,
        }}
        onLongPress={handleLongPress}
        onMapReady={handleMapReady}
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
      </MapView>
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
});