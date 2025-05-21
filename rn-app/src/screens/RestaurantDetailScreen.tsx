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
  Linking,
} from 'react-native';
import { Button, Provider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Restaurant, RootStackParamList } from '../types/restaurant';
import { colors } from '../syles/colors';
import { getPlaceDetails } from '../api/placeDetails';
import { common } from '../syles/common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { spacing } from '../syles/spacing';
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

  const [insights, setInsights] = useState<DishInsight[] | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await getPlaceDetails(restaurant.id);
        setPlace({ ...restaurant, websiteUri: d.websiteUri });
      } catch {
        setPlace(restaurant);
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurant]);

  // ChatGPT web search
  async function analyzeRestaurantReviews(
    name: string,
    websiteUrl?: string
  ): Promise<DishInsight[]> {
    // 1) initial scrape from reviews
    const initial = await callResponsesAPI(
      `Search for recent reviews of "${name}" on TripAdvisor, Yelp, and Google. ` +
        `Identify the most popular dishes, their mention counts, and any prices listed. ` +
        `Output a JSON array of objects with keys "dish", "mentions", and "price" (use null if not mentioned).`
    );

    // 2) if any price===null and websiteUrl provided, do fallback
    const needsFallback = initial.some((d) => d.price === null);
    if (needsFallback && websiteUrl) {
      const dishNames = initial.map((d) => d.dish);
      const fallback = await callResponsesAPI(
        `The restaurant's official website is: ${websiteUrl}. ` +
          `For each of these dishes: ${dishNames.join(
            ', '
          )}, find the menu price from the site. ` +
          `Output a JSON array of objects with keys "dish" and "price".`,
        true
      );

      // merge prices
      return initial.map((d) => {
        const found = fallback.find((f) => f.dish === d.dish);
        return { ...d, price: found?.price ?? d.price };
      });
    }

    return initial;
  }

 async function callResponsesAPI(
  prompt: string,
  useWebTool = true
): Promise<DishInsight[]> {
  const body: any = {
    model: 'gpt-4.1',
    instructions: 'Respond ONLY with a JSON array of objects.',
    input: prompt,
  };
  if (useWebTool) {
    body.tools = [
      {
        type: 'web_search_preview',
        user_location: { type: 'approximate', country: 'SG' },
        search_context_size: 'high',
      },
    ];
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log('API raw response:', data);

  if (!Array.isArray(data.output)) {
    throw new Error('Unexpected API response shape');
  }
  const msg = data.output.find((o: any) => o.type === 'message');
  if (!msg) throw new Error('No assistant message in response');

  // 1) Concatenate all text segments into one string
  const blocks = msg.content;
  let fullText = '';
  if (Array.isArray(blocks)) {
    for (const b of blocks) {
      fullText += typeof b === 'string' ? b : b.text ?? '';
    }
  } else if (typeof blocks === 'string') {
    fullText = blocks;
  } else {
    throw new Error('Invalid content blocks format');
  }

  // 2) Extract the JSON snippet from within the text
  let jsonText = fullText.trim();
  // If it's fenced in ```json ... ```
  const fenced = jsonText.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced && fenced[1]) {
    jsonText = fenced[1].trim();
  } else {
    // Otherwise, grab everything between the first [ and the last ]
    const start = jsonText.indexOf('[');
    const end = jsonText.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      jsonText = jsonText.substring(start, end + 1);
    }
  }

  // 3) Parse JSON
  try {
    return JSON.parse(jsonText) as DishInsight[];
  } catch (err) {
    console.error('JSON parse error on:', jsonText, err);
    throw new Error('Failed to parse JSON from model output');
  }
}

  async function handleAnalyze() {
    if (!place) return;
    setInsights(null);
    setInsightsError(null);
    setInsightsLoading(true);

    try {
      const results = await analyzeRestaurantReviews(
        place.name,
        place.websiteUri
      );
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
      <ScrollView style={{ flex: 1, backgroundColor:colors.background }}>
        <View style={styles.center}>
          <Image
            source={{ uri: place.image }}
            style={{ width:'60%', height: 300 }}
            resizeMode='contain'
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{place.name}</Text>
          <View style={styles.detailsPill}>
            <MaterialIcons
                name="star"
                size={14}
                color={colors.primary}
                style={{ marginRight: spacing.xs }}
            />
              <Text style={{ color: colors.textBright }} >{restaurant.rating}</Text>
          </View>
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
              buttonColor= {insightsLoading ? '#599566' : '#8ECE91'}  // Move this to colors if needed
              style={{ marginLeft: 12 }}
            >
              {insightsLoading ? 'Analyzing...' : 'Analyze Reviews'}
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
              keyExtractor={(_, i) => i.toString()}
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  <Text style={[styles.header, styles.flex2]}>Dish</Text>
                  <Text style={[styles.header, styles.flex1]}>
                    Mentions
                  </Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.md, color:colors.textBright},
  sub: { color: '#6b7280', marginBottom: 16, },
  desc: { lineHeight: 20, color:colors.textBright},
  buttonRow: { flexDirection: 'row', marginTop: 24, alignItems: 'center' },
  errorText: { color: 'red', marginTop: 12 },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: { fontWeight: 'bold' },
  cell: { fontSize: 14, color:colors.textBright},
  flex2: { flex: 2, color:colors.textBright},
  flex1: { flex: 1, textAlign: 'center', color:colors.textBright},
  detailsPill: {
    flexDirection: 'row',
    alignItems:    'center',
    alignSelf:     'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical:   spacing.xs,
    borderRadius:      spacing.md,
    borderWidth:       1,
    borderColor:       colors.gray300,
    color:colors.textBright,
    marginBottom: spacing.md,
  },
});
