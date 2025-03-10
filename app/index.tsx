import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, StatusBar, Modal, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Map from '../components/Map';
import MarkerAction from '../components/MarkerAction';
import { MarkerData } from '../utils/types';
import { useDatabase } from '../contexts/DatabaseContext';

export default function MapScreen() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const router = useRouter();
  const { getAllMarkers, addMarker, deleteMarker } = useDatabase();

  const loadMarkers = async () => {
    try {
      const loadedMarkers = await getAllMarkers();
      setMarkers(loadedMarkers);
    } catch (error) {
      console.error('Ошибка при загрузке маркеров:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMarkers();
    }, [getAllMarkers])
  );

  const handleAddMarker = async (marker: MarkerData) => {
    try {
      const newMarkerId = await addMarker(marker);
      if (newMarkerId) {
        setMarkers((prev) => [...prev, { ...marker, id: newMarkerId }]);
      }
    } catch (error) {
      console.error('Ошибка при добавлении маркера:', error);
    }
  };

  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const handleDeleteMarker = async (marker: MarkerData) => {
    try {
      await deleteMarker(marker);
      setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
      setModalVisible(false);
    } catch (error) {
      console.error('Ошибка при удалении маркера:', error);
    }
  };

  const handleMapReady = () => {
    setMapError(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {mapError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mapError}</Text>
        </View>
      )}
      <Map
        markers={markers}
        onMarkerPress={handleMarkerPress}
        onMapReady={handleMapReady}
        onError={setMapError}
        onAddMarker={handleAddMarker}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <MarkerAction
          marker={selectedMarker!}
          onInfoPress={() => {
            setModalVisible(false);
            router.push({
              pathname: `/marker/${selectedMarker?.id}`,
              params: { marker: JSON.stringify(selectedMarker) },
            });
          }}
          onDeletePress={() => {
            if (selectedMarker) {
              handleDeleteMarker(selectedMarker);
            }
          }}
          onCancelPress={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    zIndex: 1,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});