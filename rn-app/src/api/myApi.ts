import axios from 'axios';
import { Restaurant } from '../types/restaurant';

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');

  return data.map((u: any) => ({
    id: u.id,
    name: u.name,
    description: u.company.catchPhrase,
    image: `https://picsum.photos/seed/${u.id}/400/300`,
    rating: Math.floor(Math.random() * 5) + 1,
  }));
}