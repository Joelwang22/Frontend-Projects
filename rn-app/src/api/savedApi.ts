import axios from 'axios';

const raw = process.env.EXPO_PUBLIC_STRAPI_URL!;
export const STRAPI = raw.endsWith('/')
  ? raw.slice(0, -1)   // drop trailing slash
  : raw;

/** Raw Strapi item shape */
interface StrapiItem<T> {
  id: number;
  attributes: T;
}

export interface SavedAttributes {
  restaurant_id: string;
  name: string;
  description: string;
  image_url?: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export type SavedRecord = {
  id: number;
  attributes: SavedAttributes;
};

/** Fetching */
export async function getSaved(): Promise<SavedRecord[]> {
  const { data } = await axios.get<{ data: SavedRecord[] }>(
    `${STRAPI}/api/saved-restaurants`,
    { params: { sort: 'createdAt:desc' } }
  );
  return data.data;
}

/** Saving */
export async function saveRestaurant(
  r: Omit<SavedAttributes, 'createdAt' | 'updatedAt'>
): Promise<SavedRecord> {
  const payload = { data: r };
  console.log('➡️ POST /api/saved-restaurants', payload);
  try {
    const { data } = await axios.post<{ data: SavedRecord }>(
      `${STRAPI}/api/saved-restaurants`,
      payload
    );
    console.log('✅ saved record', data);
    return data.data;
  } catch (e: any) {
    console.error('❌ saveRestaurant error', e.response?.data);
    throw e;
  }
}

/** Removal */
export async function removeSaved(recordId: number): Promise<void> {
  try {
    await axios.delete(`${STRAPI}/api/saved-restaurants/${recordId}`);
  } catch (e: any) {
    console.error('❌ removeSaved error', e.response?.data);
    throw e;
  }
}
