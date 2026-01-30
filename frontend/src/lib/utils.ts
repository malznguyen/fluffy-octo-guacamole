import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price to Vietnamese currency format
 * Example: 1250000 -> "1.250.000đ"
 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ'
}
