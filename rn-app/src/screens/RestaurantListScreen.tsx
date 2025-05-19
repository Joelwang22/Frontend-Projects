import React from 'react';
import { FlatList, View, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant } from '../types/restaurant';
import { getNearbyRestaurants } from '../api/placesApi';
import { useLocation } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function RestaurantListScreen({ navigation }: Props) {
  const { coords } = useLocation();
  const [data, setData] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
    (async () => {
        setLoading(true);
        try {
        const lat = coords?.lat ?? 1.2839;      
        const lng = coords?.lng ?? 103.8515;
        console.log('📡 calling Google Places…');
        const list = await getNearbyRestaurants(lat, lng);
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
    }, [coords]);

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
