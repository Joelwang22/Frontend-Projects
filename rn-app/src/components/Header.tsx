import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import { useLocation } from '../context/LocationContext';
import { colors } from '../syles/colors';

const Stack = createNativeStackNavigator<RootStackParamList>(); 


export default function Header() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { coords, setCoords } = useLocation();

  return (
    <Appbar.Header mode="small" style={{ backgroundColor: colors.icons }}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="menu"
            onPress={() => setMenuVisible(true)}
            accessibilityLabel="Open menu"
          />
        }
      >
        <Menu.Item 
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('List')} 
          }
          title="Home" />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('Saved');
          }}
          title="Saved Restaurants"
        />
        {/* add more items here */}
      </Menu>

      {/* App name */}
      <Appbar.Content
        title="E@Where"
        titleStyle={{ fontWeight: 'bold' }}
      />

      {/* Location icon */}
      <Appbar.Action
        icon="map-marker"
        onPress={() => {
            navigation.navigate('PickLocation', {
            onPick: setCoords,
            initial: coords ?? undefined,
            });
        }}
        accessibilityLabel="Location"
      />
    </Appbar.Header>
  );
}