import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SetType } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB',
    minimumFractionDigits: 0 
  }).format(amount);
}

// Helper function to format set_type for display
export function formatSetType(setType: SetType | null): string {
  if (!setType) return 'N/A';
  
  const items = Object.entries(setType)
    .filter(([, value]) => value)
    .map(([key]) => key.replace('_', ' '));
    
  return items.length > 0 ? items.join(', ') : 'Watch only';
}

// Helper function to get set type items as array
export function getSetTypeItems(setType: SetType | null): string[] {
  if (!setType) return [];
  
  return Object.entries(setType)
    .filter(([, value]) => value)
    .map(([key]) => key);
}

// Helper function to check if set type has specific item
export function hasSetTypeItem(setType: SetType | null, item: string): boolean {
  if (!setType) return false;
  return setType[item] === true;
}