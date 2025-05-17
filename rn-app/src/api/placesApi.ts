import axios from 'axios';
import Constants from 'expo-constants';
import { Restaurant } from '../types/restaurant';

const key = Constants.expoConfig?.extra?.placesApiKey;
const ENDPOINT = 'https://places.googleapis.com/v1/places:searchNearby';

const FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.rating,places.photos';

interface NearbyResponse {
  places: {
    id: string;
    displayName: { text: string };
    formattedAddress: string;
    rating?: number;
    photos?: { name: string }[];
  }[];
}

export async function getNearbyRestaurants(
  lat: number,
  lng: number,
  radius = 1500
): Promise<Restaurant[]> {
  const { data } = await axios.post<NearbyResponse>(
    `${ENDPOINT}?key=${key}`,
    {
      includedTypes: ['restaurant'],
      maxResultCount: 20,
      locationRestriction: {
        circle: { center: { latitude: lat, longitude: lng }, radius },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': FIELD_MASK,
      },
    }
  );

  return data.places.map((p) => ({
    id: p.id,
    name: p.displayName?.text ?? 'Unnamed place',
    description: p.formattedAddress ?? '',
    image: p.photos?.length
      ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=400&key=${key}`
      : 'https://picsum.photos/400/300',
    rating: p.rating ?? 4,
  }));
}