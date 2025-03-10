import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable } from 'react-native';
import { ImageListProps } from '../utils/props';

export default function ImageList({ marker, onAddImage, onRemoveImage}: ImageListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Изображения</Text>
      <Pressable style={styles.addButton} onPress={onAddImage}>
        <Text style={styles.addButtonText}>Добавить изображение</Text>
      </Pressable>
      <FlatList
        data={marker.images || []}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Pressable style={styles.removeButton} onPress={() => onRemoveImage(item)}>
              <Text style={styles.removeButtonText}>Удалить</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  imageContainer: {
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  addButton: {
    backgroundColor: 'rgb(164, 155, 212)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'rgb(164, 155, 212)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});