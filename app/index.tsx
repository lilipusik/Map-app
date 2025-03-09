import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Modal, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useMarkerStore } from '../utils/store';
import Map from '../components/Map';
import { MarkerData } from '../utils/types';
import MarkerAction from '../components/MarkerAction';

export default function MapScreen() {
  const { markers, addMarker, deleteMarker } = useMarkerStore();
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddMarker = (marker: MarkerData) => {
    addMarker(marker);
  };

  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const handleDeleteMarker = (markerId: string) => {
    deleteMarker(markerId);
    setModalVisible(false);
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
              handleDeleteMarker(selectedMarker.id);
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