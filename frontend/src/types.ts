export interface ISarqytCard {
  id: number;
  product_title: string;
  sarqyt_description?: string;
  original_price: string;
  discounted_price: string;
  quantity_available: number;
  pickup_start: Date|string;
  pickup_end: Date|string;
  product_image?: string;
  isFavorite: boolean;
  getSarqytsData: () => void;
  status: string;
  logo: string;
  shop: string;
}

export interface IExtendedSarqytCard extends ISarqytCard {
  shop_id: number;
  available_until: string;
  created_at: string;
  shop_img: string;
  rate: number;
  address: string;
  sarqyt_description?: string;
  categories: string[];
  isReserved: boolean;
}

export interface IShop {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  address: string;
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


export interface ICategory {
  id: number;
  name: string;
}

export interface IShopSarqytCard {
  id: number;
  product_title: string;
  discounted_price: string;
  quantity_available?: number;
  pickup_start: string;
  pickup_end: string;
  image_url: string;
}

export interface IOrder {
  id: number;
  quantity: number;
  total_price: string;
  status: string;
  payment_method: string;
  payment_status: string;
  pickup_code?: string;
  pickup_time?: string;
  created_at: string;
  updated_at?: string;

  sarqyt_id: number;
  sarqyt_title: string;
  sarqyt_image: string;
  discounted_price: string;
  original_price: string;

  shop_id: number;
  shop_name: string;
  shop_image: string;
  shop_address: string;
}