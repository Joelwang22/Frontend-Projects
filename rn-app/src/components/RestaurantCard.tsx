import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { common } from '../syles/common';
import { colors } from '../syles/colors';
import { spacing } from '../syles/spacing';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  saveRestaurant,
  removeSaved,
  getSaved,
  SavedRecord,
  STRAPI,
} from '../api/savedApi';

interface Props {
  restaurant: {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
  };
  onPress: () => void;
  onToggleSave?: () => void;
}

const RestaurantCard: React.FC<Props> = React.memo(
  ({ restaurant, onPress, onToggleSave }: Props) => {
    const [saved, setSaved] = useState(false);
    const [record, setRecord] = useState<SavedRecord | null>(null);

    // check if this restaurant is already saved
    useEffect(() => {
      (async () => {
        try {
          const list = await getSaved();
          const hit = list.find((s) => s.restaurant_id === restaurant.id);
          if (hit) {
            setSaved(true);
            setRecord(hit);
          } else {
            setSaved(false);
            setRecord(null);
          }
        } catch (err) {
          console.error('Error fetching saved list', err);
        }
      })();
    }, [restaurant.id]);

    const toggleSave = async () => {
      try {
        if (saved && record) {
          console.log(`➡️ DELETE ${STRAPI}/api/saved-restaurants/${record.id}`);
          await removeSaved(record.documentId);
          setSaved(false);
          setRecord(null);
          onToggleSave && onToggleSave(); 
        } else {
          const newRec = await saveRestaurant({
            restaurant_id: restaurant.id,
            name: restaurant.name,
            description: restaurant.description,
            image_url: restaurant.image,
            rating: restaurant.rating,
          });
          setSaved(true);
          setRecord(newRec);
        }
      } catch (err) {
        console.error('Error toggling save', err);
      }
    };

    return (
      <Card mode="elevated" onPress={onPress} style={local.card}>
        <Card.Content style={local.content}>
          <View style={local.row}>
            <View style={local.details}>
              <Image
                source={{ uri: restaurant.image }}
                style={local.thumb}
              />
              <View style={local.info}>
                <Text variant="titleLarge" style={local.title}>
                  {restaurant.name}
                </Text>
                <View style={common.pill}>
                  <MaterialIcons
                    name="star"
                    size={14}
                    color={colors.primary}
                    style={{ marginRight: spacing.xs }}
                  />
                  <Text variant="bodyMedium">{restaurant.rating}</Text>
                </View>
              </View>
            </View>

            <Card.Actions style={local.actions}>
              <IconButton
                icon={saved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                onPress={toggleSave}
                accessibilityLabel={saved ? 'Unsave' : 'Save'}
              />
            </Card.Actions>
          </View>
        </Card.Content>
      </Card>
    );
  }
);

const local = StyleSheet.create({
  card: { marginVertical: 6, backgroundColor: colors.cards},
  content: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent:"space-between" },
  thumb: { width: 64, height: 64, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  title: { marginBottom: spacing.xs },
  actions: { justifyContent: 'flex-end', marginLeft: "auto" },
  details: {flexDirection: 'row', alignItems: 'center',flex: 1 },
});

export default RestaurantCard;
