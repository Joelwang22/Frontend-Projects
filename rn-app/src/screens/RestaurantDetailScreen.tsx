import { View, Text, Image, ScrollView, Alert, Platform, ActivityIndicator, Linking } from 'react-native';
import { Button, Dialog, Portal, Provider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Restaurant, RootStackParamList } from '../types/restaurant';
import { useEffect, useState } from 'react';
import { colors } from '../syles/colors';
import { getPlaceDetails } from '../api/placeDetails';
import React from 'react';


type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

type RestaurantWithSite = Restaurant & { websiteUri?: string };

export default function RestaurantDetailScreen({ route, navigation } : Props) {
  const { restaurant } = route.params;
  const [place, setPlace] = useState<RestaurantWithSite | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    (async () => {
        try {
          const d = await getPlaceDetails(restaurant.id);
          setPlace({ ...restaurant, websiteUri: d.websiteUri });
        } catch (e) {
          console.error('place-details failed', e);
          setPlace(restaurant);        
        } finally {
          setLoading(false);
        }
      })();
  }, [restaurant]);
  
    if (loading || !place) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: place.image }} style={{ width: '60%', height: 240 }} />
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            {place.name}
          </Text>
          <Text style={{ color: '#6b7280', marginBottom: 16 }}>
            {place.rating} ★
          </Text>
          <Text style={{ lineHeight: 20 }}>{place.description}</Text>

          <View style={{ marginTop: 24 }}>
            {place.websiteUri && (
              <Button
                mode="outlined"
                onPress={() => Linking.openURL(place.websiteUri!)}
                buttonColor={colors.base}
                textColor={colors.textDark}
              >
                Visit Website
              </Button>
            )}

            <Button
              mode="outlined"
              onPress={navigation.goBack}
              style={{ marginTop: 12 }}
              buttonColor={colors.back}
              textColor={colors.textDark}
            >
              Back
            </Button>
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}