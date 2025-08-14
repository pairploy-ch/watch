export type WatchMedia = {
  id: number;
  watch_id: number;
  url: string;
  type: 'image' | 'video';
  position: number;
  created_at: string;
};

export type SetType = {
  box?: boolean;
  card?: boolean;
  manual?: boolean;
  warranty?: boolean;
  papers?: boolean;
  extra_links?: boolean;
  travel_case?: boolean;
  [key: string]: boolean | undefined;
};

export type Watch = {
  id: number;
  ref: string;
  brand: string;
  model: string | null;
  watch_year: number | null;
  serial_no: string | null;
  product_type: 'New' | 'Used' | 'Vintage' | 'NOS' | null;
  set_type: SetType | null;
  size_mm: number | null;
  material: string | null;
  cost_price: number | null;
  selling_price: number | null;
  currency: 'THB' | 'USD' | 'EUR';
  status: 'Available' | 'Reserved' | 'Sold' | 'Hidden';
  is_public: boolean;
  notes: string | null;
  supplier_id: number | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  media?: WatchMedia[];
  // Commission fields
  ownership_type: 'stock' | 'commission';
  commission_rate?: number | null; // เปอร์เซ็นต์
  commission_amount?: number | null; // จำนวนเงิน
  owner_name?: string | null; // ชื่อเจ้าของนาฬิกา
  owner_contact?: string | null; // ติดต่อเจ้าของ
  // Computed fields from SQL
  profit?: number;
  margin_percent?: number;
  profit_status?: 'positive' | 'negative' | 'break_even' | 'commission' | 'unknown';
};

export type Supplier = {
  id: number;
  name: string;
  contact_info: string | null;
  created_at: string;
};

export type Customer = {
  id: number;
  full_name: string;
  phone: string | null;
  social_contact: string | null;
  address: string | null;
  created_at: string;
};

export type Invoice = {
  id: number;
  watch_id: number;
  customer_id: number;
  sale_price: number;
  sale_date: string;
  created_at: string;
  watches?: Partial<Watch>;
};