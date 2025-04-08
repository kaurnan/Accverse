// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
 
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export function formatDate(input: string | number): string {
//   const date = new Date(input)
//   return date.toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   })
// }

// export function formatPrice(
//   price: number | string,
//   options: {
//     currency?: "USD" | "EUR" | "GBP" | "BDT"
//     notation?: Intl.NumberFormatOptions["notation"]
//   } = {}
// ) {
//   const { currency = "USD", notation = "compact" } = options

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     notation,
//   }).format(Number(price))
// }

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
