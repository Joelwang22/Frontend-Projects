export interface Restaurant {
    id: number;
    name: string;
    description: string;
    image: string;
    rating: number;
}
  
export type RootStackParamList = {
    List: undefined;                             
    Detail: { restaurant: Restaurant };           
};