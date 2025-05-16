import axios from 'axios';

export type Restaurant = {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
};

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data } = await axios.get<Restaurant[]>(
    'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-APIs/main/menu.json'
  );
  return data;
}