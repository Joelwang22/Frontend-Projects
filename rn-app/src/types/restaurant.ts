export interface Restaurant {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
}
  
export type RootStackParamList = {
  List: undefined;
  Detail: { restaurant: Restaurant };
  PickLocation: {
    initial?: { lat: number; lng: number };
    onPick: (coords: { lat: number; lng: number }) => void;
  };
};