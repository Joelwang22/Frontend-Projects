import React from 'react';
import { FlatList, View, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant } from '../types/restaurant';
import { getNearbyRestaurants } from '../api/placesApi';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function RestaurantListScreen({ navigation }: Props) {
  const [data, setData] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
    (async () => {
        try {
        console.log('📡 calling Google Places…');
        const list = await getNearbyRestaurants(1.2839, 103.8515);
        console.log('✅ got', list.length, 'places');
        setData(list);
        } catch (err: any) {
        console.error('❌ Places error', err?.response?.data || err.message);
        Alert.alert(
            'Places error',
            JSON.stringify(err?.response?.data ?? err.message)
        );
        } finally {
        setLoading(false);
        }
    })();
    }, []);

    if (loading) {
    return (
        <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        </View>
    );
    }

    const renderItem = ({ item }: { item: Restaurant }) => (
        <RestaurantCard
            restaurant={item}
            onPress={() => navigation.navigate('Detail', { restaurant: item })}
        />
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(r) => r.id}
            getItemLayout={(_, i) => ({ length: 92, offset: 92 * i, index: i })}
            contentContainerStyle={{ padding: 12 }}
        />
    );
}
