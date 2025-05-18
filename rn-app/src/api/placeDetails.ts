import axios from 'axios';
import Constants from 'expo-constants';

const key =
  process.env.EXPO_PUBLIC_PLACES_API_KEY ??
  Constants.expoConfig?.extra?.placesApiKey;

const FIELD_MASK = 'websiteUri';

export interface PlaceDetailsResponse {
  websiteUri?: string;      // all we ask for
}

export async function getPlaceDetails(placeId: string) {
  const { data } = await axios.get<PlaceDetailsResponse>(
    `https://places.googleapis.com/v1/places/${placeId}`,
    { params: { key, fields: FIELD_MASK } }
  );
  return data;  
}