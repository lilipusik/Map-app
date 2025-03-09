export interface MarkerData {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
    address?: string;
    images?: string[];
  }

  export interface MarkerStore {
    markers: MarkerData[];
    addMarker: (marker: MarkerData) => void;
    updateMarker: (updatedMarker: MarkerData) => void;
    deleteMarker: (markerId: string) => void;
    addImageToMarker: (markerId: string, imageUri: string) => void;
    removeImageFromMarker: (markerId: string, imageUri: string) => void;
  }