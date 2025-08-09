export interface ISarqytCard {
  id: number;
  title: string;
  original_price: string;
  discounted_price: string;
  quantity_available: number;
  pickup_start: string;
  pickup_end: string; 
  image_url: string;
}


export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface ICity {
  id: number;
  name: string;
}
