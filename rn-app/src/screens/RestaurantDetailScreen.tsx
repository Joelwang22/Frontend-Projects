import { View, Text, Image, ScrollView, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function RestaurantDetailScreen({ route, navigation }: Props) {
    const { restaurant } = route.params;
    return (
    <ScrollView className="flex-1">
        <Image source={{ uri: restaurant.image }} className="w-full h-60" />
        <View className="p-4">
        <Text className="text-2xl font-bold mb-1">{restaurant.name}</Text>
        <Text className="text-gray-500 mb-4">{restaurant.rating} ★</Text>
        <Text className="text-base leading-6">{restaurant.description}</Text>
        <View className="mt-6">
            <Button title="Order (mock)" onPress={() => Alert.alert('Pretend checkout')} />
            <Button title="Back" onPress={() => navigation.goBack()} color={"#e10000"}/>
        </View>
        </View>
    </ScrollView>
    );
}