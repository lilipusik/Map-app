import { create } from 'zustand';
import { MarkerStore } from './types';

export const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],

    addMarker: (marker) => set((state) => ({ markers: [...state.markers, marker] })),
    updateMarker: (updatedMarker) =>
      set((state) => ({
        markers: state.markers.map((marker) =>
          marker.id === updatedMarker.id ? updatedMarker : marker
        ),
      })),

    deleteMarker: (markerId) =>
      set((state) => ({ markers: state.markers.filter((marker) => marker.id !== markerId) })),

    addImageToMarker: (markerId, imageUri) =>
      set((state) => ({
        markers: state.markers.map((marker) =>
          marker.id === markerId
            ? { ...marker, images: [...(marker.images || []), imageUri] }
            : marker
        ),
      })),
      
    removeImageFromMarker: (markerId, imageUri) =>
      set((state) => ({
        markers: state.markers.map((marker) =>
          marker.id === markerId
            ? { ...marker, images: marker.images?.filter((uri) => uri !== imageUri) }
            : marker
        ),
      })),
  }));
  