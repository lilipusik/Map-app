import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { MarkerData, MarkerImage } from '../../utils/types';
import ImageList from '../../components/ImageList';
import Toast, { ToastConfigParams } from 'react-native-toast-message';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function MarkerDetails() {
  const { marker: markerString } = useLocalSearchParams();
  const marker = JSON.parse(markerString as string) as MarkerData;
  const [currentMarker, setCurrentMarker] = useState<MarkerData>(marker);
  const { getMarkerById, getImages, updateMarker, addImage, deleteImage } = useDatabase();

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const markerData = await getMarkerById(marker.id!);
        const images = await getImages(marker.id!);
        setCurrentMarker({
          ...markerData!,
          images: images,
        });
      } catch (error) {
        console.error('Ошибка при получении данных маркера:', error);
      }
    };

    fetchMarkerData();
  }, [marker.id, getMarkerById, getImages]);

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
      try {
        const imageUri = result.assets[0].uri;
        await addImage({ marker_id: currentMarker.id!, uri: imageUri });
        setCurrentMarker((prev) => ({
          ...prev,
          images: [...(prev.images || []), { marker_id: currentMarker.id!, uri: imageUri }],
        }));
        Toast.show({
          type: 'success',
          text1: 'Сохранено',
          text2: 'Изображение добавлено',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Ошибка при добавлении изображения:', error);
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Не удалось добавить изображение',
          position: 'bottom',
        });
      }
    }
  };

  const removeImage = async (image: MarkerImage) => {
    try {
      await deleteImage(image);
      setCurrentMarker((prev) => ({
        ...prev,
        images: prev.images?.filter((img) => img.id !== image.id),
      }));
      Toast.show({
        type: 'success',
        text1: 'Сохранено',
        text2: 'Изображение удалено',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось удалить изображение',
        position: 'bottom',
      });
    }
  };

  const handleSave = async () => {
    try {
      await updateMarker(currentMarker);
      const updatedMarker = await getMarkerById(currentMarker.id!);
      const images = await getImages(currentMarker.id!);
      setCurrentMarker({
        ...updatedMarker!,
        images: images,
      });

      Toast.show({
        type: 'success',
        text1: 'Сохранено',
        text2: 'Маркер успешно обновлен',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Ошибка при сохранении маркера:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить маркер',
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редактирование маркера</Text>
      <TextInput
        style={styles.input}
        placeholder="Название"
        value={currentMarker.title}
        onChangeText={(text) =>
          setCurrentMarker((prev) => ({ ...prev, title: text }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Описание"
        value={currentMarker.description}
        onChangeText={(text) =>
          setCurrentMarker((prev) => ({ ...prev, description: text }))
        }
      />
      <TextInput
        style={styles.readonly}
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
      <Toast config={toastConfig} />
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
    borderColor: 'rgb(164, 155, 212)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'rgb(108, 62, 151)',
  },
  readonly: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'rgb(0, 0, 0)',
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

const toastConfig = {
  success: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{ backgroundColor: 'rgb(164, 155, 212)', padding: 10, borderRadius: 5 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
      <Text style={{ color: 'white' }}>{text2}</Text>
    </View>
  ),
  error: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{ backgroundColor: 'rgb(119, 60, 60)', padding: 10, borderRadius: 5 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
      <Text style={{ color: 'white' }}>{text2}</Text>
    </View>
  ),
};