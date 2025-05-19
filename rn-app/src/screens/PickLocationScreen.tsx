import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
} from '@react-google-maps/api';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import { useLocation } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PickLocation'>;

const WEB_MAP_KEY = process.env.EXPO_PUBLIC_GOOGLE_WEB_MAPS_KEY!;

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const containerStyle = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default function PickLocationScreen({ navigation, route }: Props) {
  const initial = route.params.initial ?? null;
  const [marker, setMarker] = useState<typeof initial>(initial);
  const [region, setRegion] = useState<Region>({
    latitude: initial?.lat ?? 1.2839,
    longitude: initial?.lng ?? 103.8515,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [ready, setReady] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: WEB_MAP_KEY,
    libraries: [],
  });

  const { setCoords } = useLocation();

  useEffect(() => {
    // only run GPS if there was no 'initial' coordinate
    if (initial) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    })();
  }, [initial]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat(), lng = e.latLng.lng();
    setMarker({ lat, lng });
    setRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.02, longitudeDelta: 0.02 });
  }, []);

  const confirm = () => {
    console.log(marker);
    if (!marker) return;
    route.params?.onPick(marker);
    setCoords(marker);
    navigation.goBack();
  };

  if (!isLoaded) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: region.latitude, lng: region.longitude }}
        zoom={15}
        onClick={onMapClick}
        onLoad={() => setReady(true)}
      >
        {marker && <MarkerF position={marker} />}
      </GoogleMap>

      <View style={styles.btnContainer}>
        <Button title="Set this location" onPress={confirm} disabled={!marker} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
});
