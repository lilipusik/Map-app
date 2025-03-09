import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MarkerActionProps } from '../utils/props';

export default function MarkerAction({ onInfoPress, onDeletePress, onCancelPress }: MarkerActionProps) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Выберите действие</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onInfoPress}>
          <Text style={styles.buttonText}>Информация</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={onDeletePress}>
          <Text style={styles.buttonText}>Удалить маркер</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={onCancelPress}>
          <Text style={styles.buttonText}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'rgb(164, 155, 212)',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});