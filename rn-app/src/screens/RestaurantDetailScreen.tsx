import { View, Text, Image, ScrollView, Alert, Platform } from 'react-native';
import { Button, Dialog, Portal, Provider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/restaurant';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

function showBookingDialog() {
  if (Platform.OS === 'web') {
    window.alert('Booking simulation (diff alert on phone)');
  } else {
    Alert.alert(
      'Booking',
      'Would you like to confirm booking?',
      [
        { text: 'Yes' },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }
}

export default function RestaurantDetailScreen({ route, navigation } : Props) {
  const { restaurant } = route.params;
  const [open, setOpen] = React.useState(false);

  const confirmBooking = () => {
    // TODO: call API or navigate
    setOpen(false);
  };

  return (

    <Provider>
      <ScrollView style={{ flex: 1 }}>
        <View style={{alignItems: "center"}}>
            <Image source={{ uri: restaurant.image }} style={{ width: '60%', height: 240 }} />
        </View>
        
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            {restaurant.name}
          </Text>
          <Text style={{ color: '#6b7280', marginBottom: 16 }}>
            {restaurant.rating} ★
          </Text>
          <Text style={{ lineHeight: 20 }}>{restaurant.description}</Text>

          <View style={{ marginTop: 24 }}>
            <Button mode="contained" onPress={() => setOpen(true)}>
              Make a Booking
            </Button>

            <Button
              mode="outlined"
              onPress={navigation.goBack}
              style={{ marginTop: 12 }}
              textColor="#e10000"
            >
              Back
            </Button>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={open} onDismiss={() => setOpen(false)}>
          <Dialog.Title>Booking</Dialog.Title>
          <Dialog.Content>
            <Text>Would you like to confirm your booking?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpen(false)}>No</Button>
            <Button onPress={confirmBooking}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}