import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/restaurant';
import RestaurantListScreen from './src/screens/RestaurantListScreen';
import RestaurantDetailScreen from './src/screens/RestaurantDetailScreen';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import Header from './src/components/Header';
import PickLocationScreen from './src/screens/PickLocationScreen';
import { LocationProvider } from './src/context/LocationContext';
import SavedListScreen from './src/screens/SavedListScreen';
import { Provider as PaperProvider } from 'react-native-paper';

if (Platform.OS !== 'web') {
  enableScreens();
}

const Stack = createNativeStackNavigator<RootStackParamList>(); 

export default function App() {
  return (
    <PaperProvider>
      <LocationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ header: ()=> <Header/> }}>
            <Stack.Screen name="List" component={RestaurantListScreen} />
            <Stack.Screen name="Detail" component={RestaurantDetailScreen} />
            <Stack.Screen name="PickLocation" component={PickLocationScreen} />
            <Stack.Screen name="Saved" component={SavedListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </PaperProvider>
  );
}