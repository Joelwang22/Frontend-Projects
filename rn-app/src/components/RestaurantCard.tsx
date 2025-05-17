import { Image, View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import React from 'react';
import { Restaurant } from '../types/restaurant';
import { common } from '../syles/common';
import { colors } from '../syles/colors';
import { spacing } from '../syles/spacing';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
    restaurant: Restaurant;
    onPress: () => void;
}

const RestaurantCard = React.memo(({ restaurant, onPress }: Props) => (
  <Card mode="elevated" onPress={onPress} style={local.card}>
    <Card.Content
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
    >
      <Image
        source={{ uri: restaurant.image }}
        style={{ width: 64, height: 64, borderRadius: 8 }}
      />
      <View style={{ marginLeft: 12, flex: 1, flexDirection:'row', alignItems: 'center', padding: 4}}>
        <Text variant="titleLarge"  style ={{marginRight: spacing.xs}}>{restaurant.name}</Text>
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
    </Card.Content>
  </Card>
));

const local = StyleSheet.create({
  card:     { marginVertical: 6 },
  content:  { paddingVertical: 12 },
  thumb:    { width: 64, height: 64, borderRadius: 8 },
  info:     { flex: 1, marginLeft: 12 },
});

export default RestaurantCard;