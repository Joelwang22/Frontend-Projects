import { Text, TouchableOpacity, Image, View } from 'react-native';
import React from 'react';
import { Restaurant } from '../types/restaurant';

interface Props {
    restaurant: Restaurant;
    onPress: () => void;
}

const RestaurantCard = React.memo(({ restaurant, onPress }: Props) => (
    <TouchableOpacity onPress={onPress} className="flex-row p-3 bg-white mb-2 rounded-xl shadow">
    <Image source={{ uri: restaurant.image }} className="w-16 h-16 rounded-lg" />
    <View className="flex-1 ml-3 justify-center">
        <Text className="font-semibold text-lg">{restaurant.name}</Text>
        <Text className="text-gray-500">{restaurant.rating} ★</Text>
    </View>
    </TouchableOpacity>
));

export default RestaurantCard;