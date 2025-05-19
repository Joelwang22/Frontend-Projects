import axios from 'axios';

const raw = process.env.EXPO_PUBLIC_STRAPI_URL!;
export const STRAPI = raw.endsWith('/')
  ? raw.slice(0, -1)   // drop trailing slash
  : raw;

const TOKEN = process.env.EXPO_PUBLIC_STRAPI_TOKEN!;

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
  documentId: string;
  restaurant_id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
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
export async function removeSaved(documentId: string): Promise<void> {
  try {
    console.log(`➡️ DELETE ${STRAPI}/api/saved-restaurants/${documentId}`);
    const res = await axios.delete(
      `${STRAPI}/api/saved-restaurants/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    console.log('✅ delete response status:', res.status);
  } catch (e: any) {
    console.error('❌ removeSaved error', e.response?.data || e.message);
    throw e;
  }
}
/* Deleting using restaurant ID*/
export async function deleteByRestaurantId(restaurantId: string): Promise<void> {
  const resp = await axios.get<{ data: StrapiItem<SavedAttributes>[] }>(
    `${STRAPI}/api/saved-restaurants`,
    {
      params: {
        'filters[restaurant_id][$eq]': restaurantId,
      },
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  const items = resp.data.data;
  if (items.length === 0) return;      
  const recordId = items[0].id;

  await axios.delete(
    `${STRAPI}/api/saved-restaurants/${recordId}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}