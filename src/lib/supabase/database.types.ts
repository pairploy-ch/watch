// @/lib/supabase/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: number;
          user_id: string | null;
          user_email: string | null;
          action_type: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          user_email?: string | null;
          action_type: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          user_email?: string | null;
          action_type?: string;
          details?: Json | null;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: number;
          full_name: string;
          phone: string | null;
          social_contact: string | null;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          phone?: string | null;
          social_contact?: string | null;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          full_name?: string;
          phone?: string | null;
          social_contact?: string | null;
          address?: string | null;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: number;
          watch_id: number;
          sale_price: number;
          sale_date: string;
          created_at: string;
          customer_id: number | null;
        };
        Insert: {
          id?: number;
          watch_id: number;
          sale_price: number;
          sale_date?: string;
          created_at?: string;
          customer_id?: number | null;
        };
        Update: {
          id?: number;
          watch_id?: number;
          sale_price?: number;
          sale_date?: string;
          created_at?: string;
          customer_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_customer_id_fkey';
            columns: ['customer_id'];
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_watch_id_fkey';
            columns: ['watch_id'];
            referencedRelation: 'watches';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: number;
          name: string;
          contact_info: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          contact_info?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          contact_info?: string | null;
          created_at?: string;
        };
      };
      watch_media: {
        Row: {
          id: number;
          watch_id: number;
          url: string;
          type: 'image' | 'video';
          position: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          watch_id: number;
          url: string;
          type: 'image' | 'video';
          position: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          watch_id?: number;
          url?: string;
          type?: 'image' | 'video';
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'watch_media_watch_id_fkey';
            columns: ['watch_id'];
            referencedRelation: 'watches';
            referencedColumns: ['id'];
          }
        ];
      };
      watches: {
        Row: {
          id: number;
          ref: string;
          brand: string;
          watch_year: number | null;
          cost_price: number | null;
          selling_price: number | null;
          currency: string;
          status: string;
          is_public: boolean;
          notes: string | null;
          supplier_id: number | null;
          created_at: string;
          updated_at: string;
          view_count: number;
          product_type: string | null;
          set_type: Json | null;
          size_mm: number | null;
          material: string | null;
          model: string | null;
          serial_no: string | null;
          ownership_type: string;
          commission_rate: number | null;
          commission_amount: number | null;
          owner_name: string | null;
          owner_contact: string | null;
          profit_calculated: number | null;
          margin_percent_calculated: number | null;
        };
        Insert: {
          id?: number;
          ref: string;
          brand: string;
          watch_year?: number | null;
          cost_price?: number | null;
          selling_price?: number | null;
          currency?: string;
          status?: string;
          is_public?: boolean;
          notes?: string | null;
          supplier_id?: number | null;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          product_type?: string | null;
          set_type?: Json | null;
          size_mm?: number | null;
          material?: string | null;
          model?: string | null;
          serial_no?: string | null;
          ownership_type?: string;
          commission_rate?: number | null;
          commission_amount?: number | null;
          owner_name?: string | null;
          owner_contact?: string | null;
        };
        Update: {
          id?: number;
          ref?: string;
          brand?: string;
          watch_year?: number | null;
          cost_price?: number | null;
          selling_price?: number | null;
          currency?: string;
          status?: string;
          is_public?: boolean;
          notes?: string | null;
          supplier_id?: number | null;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          product_type?: string | null;
          set_type?: Json | null;
          size_mm?: number | null;
          material?: string | null;
          model?: string | null;
          serial_no?: string | null;
          ownership_type?: string;
          commission_rate?: number | null;
          commission_amount?: number | null;
          owner_name?: string | null;
          owner_contact?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'watches_supplier_id_fkey';
            columns: ['supplier_id'];
            referencedRelation: 'suppliers';
            referencedColumns: ['id'];
          }
        ];
      };
      watches_with_calculations: {
        Row: {
          id: number;
          ref: string;
          brand: string;
          watch_year: number | null;
          cost_price: number | null;
          selling_price: number | null;
          currency: string;
          status: string;
          is_public: boolean;
          notes: string | null;
          supplier_id: number | null;
          created_at: string;
          updated_at: string;
          view_count: number;
          product_type: string | null;
          set_type: Json | null;
          size_mm: number | null;
          material: string | null;
          model: string | null;
          serial_no: string | null;
          ownership_type: string;
          commission_rate: number | null;
          commission_amount: number | null;
          owner_name: string | null;
          owner_contact: string | null;
          profit_calculated: number | null;
          margin_percent_calculated: number | null;
          profit: number;
          margin_percent: number;
          profit_status: string;
        };
        Insert: {
          id?: number;
          ref: string;
          brand: string;
          watch_year?: number | null;
          cost_price?: number | null;
          selling_price?: number | null;
          currency?: string;
          status?: string;
          is_public?: boolean;
          notes?: string | null;
          supplier_id?: number | null;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          product_type?: string | null;
          set_type?: Json | null;
          size_mm?: number | null;
          material?: string | null;
          model?: string | null;
          serial_no?: string | null;
        };
        Update: {
          id?: number;
          ref?: string;
          brand?: string;
          watch_year?: number | null;
          cost_price?: number | null;
          selling_price?: number | null;
          currency?: string;
          status?: string;
          is_public?: boolean;
          notes?: string | null;
          supplier_id?: number | null;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          product_type?: string | null;
          set_type?: Json | null;
          size_mm?: number | null;
          material?: string | null;
          model?: string | null;
          serial_no?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'watches_supplier_id_fkey';
            columns: ['supplier_id'];
            referencedRelation: 'suppliers';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: object;
    Functions: {
      calculate_watch_profit_margin: {
        Args: {
          p_selling_price: number;
          p_cost_price: number;
        };
        Returns: {
          profit: number | null;
          margin_percent: number | null;
          profit_status: string;
        }[];
      };
      calculate_commission_amount: {
        Args: {
          p_selling_price: number;
          p_commission_rate: number;
        };
        Returns: number | null;
      };
      get_commission_summary: {
        Args: {
          start_date: string;
          end_date: string;
        };
        Returns: {
          commission_watches_count: number;
          stock_watches_count: number;
          total_commission_revenue: number;
          total_stock_revenue: number;
          total_commission_amount: number;
          total_stock_profit: number;
        }[];
      };
    };
    Enums: {
      user_role: 'admin' | 'marketing' | 'viewer';
      watch_status: 'Available' | 'Reserved' | 'Sold' | 'Hidden';
    };
    CompositeTypes: object;
  };
}