import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Button, Platform } from 'react-native';
import MapView, { Marker, MapPressEvent, Region, MapViewProps } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import { useLocation } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PickLocation'>;

const WEB_MAP_KEY = process.env.EXPO_PUBLIC_GOOGLE_WEB_MAPS_KEY;
const { setCoords } = useLocation();

type WebMapViewProps = MapViewProps & {
  googleMapsApiKey?: string;
};
const Map = MapView as unknown as React.ComponentType<WebMapViewProps>;

export default function PickLocationScreen({ navigation, route }: Props) {
  const initial = route.params.initial ?? null;
  const [marker, setMarker] = useState<typeof initial>(initial);
  const [region, setRegion] = useState<Region>({
    latitude: initial?.lat ?? 1.2839,
    longitude: initial?.lng ?? 103.8515,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });


  const { setCoords } = useLocation();

 
  React.useEffect(() => {
    if (initial) return;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion((r) => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      }
    })();
  }, [initial]);

  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ lat: latitude, lng: longitude });
    setRegion({ latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 });
  };

  const confirm = () => {
    if (!marker) return;
    route.params?.onPick(marker);
    setCoords(marker);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={onMapPress}
        {...(Platform.OS === 'web' ? { googleMapsApiKey: WEB_MAP_KEY } : {})}
      >
        {marker && (
          <Marker coordinate={{ latitude: marker.lat, longitude: marker.lng }} />
        )}
      </Map>

      <View style={styles.btnContainer}>
        <Button
          title="Set this location"
          onPress={confirm}
          disabled={!marker}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  btnContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
});
