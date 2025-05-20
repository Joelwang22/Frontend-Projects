// RestaurantDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Button, Provider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Restaurant, RootStackParamList } from '../types/restaurant';
import { colors } from '../syles/colors';
import { getPlaceDetails } from '../api/placeDetails';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;
type RestaurantWithSite = Restaurant & { websiteUri?: string };
type DishInsight = { dish: string; mentions: number; price: string | null };

export default function RestaurantDetailScreen({
  route,
  navigation,
}: Props) {
  const { restaurant } = route.params;
  const [place, setPlace] = useState<RestaurantWithSite | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Review Analysis State ---
  const [insights, setInsights] = useState<DishInsight[] | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // Fetch place details (e.g. website)
  useEffect(() => {
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

  // Calls GPT-4.1 Responses API with browsing tool
  async function analyzeRestaurantReviews(
    name: string
  ): Promise<DishInsight[]> {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        instructions:
          'Respond ONLY with JSON: an array of objects { dish, mentions, price }.',
        input: `Search for recent reviews of "${name}" on TripAdvisor, Yelp, and Google. Identify the most popular dishes, their mention counts, and any prices listed. Output a JSON array of objects with keys "dish", "mentions", and "price" (use null if price is not mentioned).`,
        tools: [
          {
            type: 'web_search_preview',
            user_location: { type: 'approximate', country: 'SG' },
            search_context_size: 'high',
          },
        ],
      }),
    });

    const data = await res.json();
    console.log('OpenAI raw response:', data);

    // Responses API returns output[]
    if (!Array.isArray(data.output)) {
      throw new Error('Unexpected API response shape');
    }
    const messagePart = data.output.find(
      (o: any) => o.type === 'message' && o.content
    );
    if (!messagePart) {
      throw new Error('No assistant message in response');
    }

    // Concatenate text blocks
    const contentBlocks = messagePart.content;
    let fullText = '';
    if (Array.isArray(contentBlocks)) {
      contentBlocks.forEach((block: any) => {
        if (typeof block === 'string') {
          fullText += block;
        } else if (block.text) {
          fullText += block.text;
        }
      });
    } else if (typeof contentBlocks === 'string') {
      fullText = contentBlocks;
    } else {
      throw new Error('Invalid content blocks format');
    }

    // Strip ```json fences if present
    fullText = fullText
      .trim()
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim();

    // Parse JSON
    let dishes: DishInsight[];
    try {
      dishes = JSON.parse(fullText);
    } catch (err) {
      console.error('JSON parse error:', fullText, err);
      throw new Error('Failed to parse JSON from model output');
    }

    return dishes;
  }

  // Handler for Analyze button
  async function handleAnalyze() {
    if (!place) return;
    setInsights(null);
    setInsightsError(null);
    setInsightsLoading(true);

    try {
      const results = await analyzeRestaurantReviews(place.name);
      setInsights(results);
    } catch (err: any) {
      console.error(err);
      setInsightsError(err.message || 'Analysis failed');
    } finally {
      setInsightsLoading(false);
    }
  }

  if (loading || !place) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.center}>
          <Image
            source={{ uri: place.image }}
            style={{ width: '60%', height: 240 }}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.sub}>{place.rating} ★</Text>
          <Text style={styles.desc}>{place.description}</Text>

          <View style={styles.buttonRow}>
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
              mode="contained"
              onPress={handleAnalyze}
              loading={insightsLoading}
              disabled={insightsLoading}
              style={{ marginLeft: 12 }}
            >
              Analyze Reviews
            </Button>

            <Button
              mode="outlined"
              onPress={navigation.goBack}
              style={{ marginLeft: 12 }}
              buttonColor={colors.back}
              textColor={colors.textDark}
            >
              Back
            </Button>
          </View>

          {insightsError && (
            <Text style={styles.errorText}>{insightsError}</Text>
          )}

          {insights && (
            <FlatList
              data={insights}
              keyExtractor={(item, idx) => idx.toString()}
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  <Text style={[styles.header, styles.flex2]}>Dish</Text>
                  <Text style={[styles.header, styles.flex1]}>Mentions</Text>
                  <Text style={[styles.header, styles.flex1]}>Price</Text>
                </View>
              )}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={[styles.cell, styles.flex2]}>
                    {item.dish}
                  </Text>
                  <Text style={[styles.cell, styles.flex1]}>
                    {item.mentions}
                  </Text>
                  <Text style={[styles.cell, styles.flex1]}>
                    {item.price ?? '—'}
                  </Text>
                </View>
              )}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  sub: { color: '#6b7280', marginBottom: 16 },
  desc: { lineHeight: 20 },
  buttonRow: { flexDirection: 'row', marginTop: 24, alignItems: 'center' },
  errorText: { color: 'red', marginTop: 12 },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    fontWeight: 'bold',
  },
  cell: {
    fontSize: 14,
  },
  flex2: {
    flex: 2,
  },
  flex1: {
    flex: 1,
    textAlign: 'center',
  },
});
