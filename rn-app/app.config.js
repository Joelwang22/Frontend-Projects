import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    placesApiKey: process.env.EXPO_PUBLIC_PLACES_API_KEY,
  },
});