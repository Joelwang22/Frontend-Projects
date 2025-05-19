import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { getSaved, SavedRecord } from '../api/savedApi';
import RestaurantCard from '../components/RestaurantCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';

type Props = NativeStackScreenProps<RootStackParamList, 'Saved'>;

export default function SavedListScreen({ navigation }: Props) {
  const [list, setList] = useState<SavedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const saved = await getSaved();
        setList(saved);
      } catch (err) {
        console.error('Error fetching saved restaurants', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <RestaurantCard
          restaurant={{
            id: item.restaurant_id,
            name: item.name,
            description: item.description,
            image: item.image_url ?? '',
            rating: item.rating,
          }}
          onPress={() =>
            navigation.navigate('Detail', {
              restaurant: {
                id:          item.restaurant_id,
                name:        item.name,
                description: item.description,
                image:       item.image_url ?? '',
                rating:      item.rating,
              },
            })
          }
          onToggleSave={() =>
            setList((prev) => prev.filter((r) => r.id !== item.id))
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingVertical: 12 },
});
