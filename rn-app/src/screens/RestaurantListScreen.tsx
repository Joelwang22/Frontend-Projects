import React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import RestaurantCard from '../components/RestaurantCard';
import { getRestaurants } from '../api/myApi';
import { Restaurant } from '../types/restaurant';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function RestaurantListScreen({ navigation }: Props) {
  const [data, setData] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);

    // React.useEffect(() => {
    // (async () => {
    //     setData(await getRestaurants());
    //     setLoading(false);
    // })();
    // }, []);

    // if (loading) {
    // return (
    //     <View className="flex-1 items-center justify-center">
    //     <ActivityIndicator size="large" />
    //     </View>
    // );
    // }

    // const renderItem = ({ item }: { item: Restaurant }) => (
    //     <RestaurantCard
    //         restaurant={item}
    //         onPress={() => navigation.navigate('Detail', { restaurant: item })}
    //     />
    // );

    // return (
    //     <FlatList
    //         data={data}
    //         renderItem={renderItem}
    //         keyExtractor={(r) => r.id.toString()}
    //         getItemLayout={(_, i) => ({ length: 92, offset: 92 * i, index: i })}
    //         contentContainerStyle={{ padding: 12 }}
    //     />
    // );
    React.useEffect(() => {
    (async () => {
        console.log('🔄 Fetching restaurant list…');
        try {
        const resp = await getRestaurants();      // <-- your API call
        setData(resp);
        console.log('✅ Received', resp.length, 'items');
        } catch (err) {
        console.error('❌ getRestaurants failed:', err);
        // fallback demo item so the UI still shows something:
        setData([
            {
            id: 0,
            name: 'Fallback Bistro',
            description: 'Shows up only when API fails.',
            image: 'https://picsum.photos/400/300',
            rating: 4,
            },
        ]);
        } finally {
        setLoading(false);        // ENSURES spinner hides
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
            keyExtractor={(r) => r.id.toString()}
            getItemLayout={(_, i) => ({ length: 92, offset: 92 * i, index: i })}
            contentContainerStyle={{ padding: 12 }}
        />
    );
}
