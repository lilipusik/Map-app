import React from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { MarkerData } from '../../utils/types';
import { useMarkerStore } from '../../utils/store';
import ImageList from '../../components/ImageList';

export default function MarkerDetails() {
  const { marker: markerString } = useLocalSearchParams();
  const marker = JSON.parse(markerString as string) as MarkerData;
  const { updateMarker, addImageToMarker, removeImageFromMarker, markers } = useMarkerStore();

  const currentMarker = markers.find((m) => m.id === marker.id) || marker;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Для выбора изображения необходимо предоставить доступ к галерее.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      addImageToMarker(currentMarker.id, imageUri);
    }
  };

  const removeImage = (uri: string) => {
    removeImageFromMarker(currentMarker.id, uri);
  };

  const handleSave = () => {
    updateMarker(currentMarker);
    alert('Данные сохранены!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редактирование маркера</Text>
      <TextInput
        style={styles.input}
        placeholder="Название"
        value={currentMarker.title}
        onChangeText={(text) => updateMarker({ ...currentMarker, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Описание"
        value={currentMarker.description}
        onChangeText={(text) => updateMarker({ ...currentMarker, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Адрес"
        value={currentMarker.address}
        readOnly
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Сохранить</Text>
      </Pressable>

      <ImageList
        marker={currentMarker}
        onAddImage={pickImage}
        onRemoveImage={removeImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'rgb(164, 155, 212)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});