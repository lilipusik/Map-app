import { MarkerData, MarkerImage } from '../utils/types';
import { initDatabase } from '../database/schema';

const dbPromise = initDatabase();

// Получение всех маркеров
export const getAllMarkers = async (): Promise<MarkerData[]> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const results = await db.getAllAsync<MarkerData>(
    `SELECT * FROM markers ORDER BY created_at DESC`
  );

  if (results) {
    console.log('Маркеры успешно прочитаны');
    return results;
  }

  return [];
};

// Получение маркера по ID
export const getMarkerById = async (id: number): Promise<MarkerData | undefined> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const result = await db.getAllAsync<MarkerData>(
    `SELECT * FROM markers WHERE id = ?`,
    [id]
  );

  if (result) {
    console.log(`Маркер ${id} успешно прочитан`);
    return result[0];
  }

  return undefined;
};

// Получение изображений для маркера
export const getImages = async (markerId: number): Promise<MarkerImage[]> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const results = await db.getAllAsync<MarkerImage>(
    `SELECT * FROM marker_images WHERE marker_id = ?`,
    [markerId]
  );

  if (results) {
    console.log(`Изображения для маркера id = ${markerId} успешно прочитаны`);
    return results;
  }
  return [];
};

// Добавление нового маркера
export const addMarker = async (marker: MarkerData): Promise<number | undefined> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const result = await db.runAsync(
    `INSERT INTO markers (latitude, longitude, title, description, address) VALUES (?, ?, ?, ?, ?)`,
    [marker.latitude, marker.longitude, marker.title, marker.description, marker.address]
  );

  if (result) {
    console.log(`Маркер ${result.lastInsertRowId} успешно создан`);
    return result.lastInsertRowId;
  }
  return undefined;
};

// Добавление изображения для маркера
export const addImage = async (image: MarkerImage): Promise<void> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  await db.runAsync(
    `INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)`,
    [image.marker_id, image.uri]
  );

  console.log(`Изображение для маркера ${image.marker_id} успешно сохранено`);
};

// Обновление маркера
export const updateMarker = async (marker: MarkerData): Promise<void> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  await db.runAsync(
    `UPDATE markers SET latitude = ?, longitude = ?, title = ?, description = ?, address = ? WHERE id = ?`,
    [marker.latitude, marker.longitude, marker.title, marker.description, marker.address, marker.id!]
  );

  console.log(`Маркер id = ${marker.id} успешно обновлен`);
};

// Удаление маркера
export const deleteMarker = async (marker: MarkerData): Promise<void> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  await db.runAsync(`DELETE FROM markers WHERE id = ?`, [marker.id!]);

  console.log(`Маркер id = ${marker.id!} упешно удален`);
};

// Удаление изображения
export const deleteImage = async (image: MarkerImage): Promise<void> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  await db.runAsync(`DELETE FROM marker_images WHERE id = ?`, [image.id!]);

  console.log(`Изображение id = ${image.id!} упешно удалено`);
};