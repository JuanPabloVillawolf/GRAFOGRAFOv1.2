import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

export function parseESDate(str: string) {
  if (!str) return new Date();
  // Match "DD/MM/YYYY HH:MM:SS" or "DD/MM/YYYY, HH:MM:SS"
  const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const year = parseInt(match[3]);
    const hour = match[4] ? parseInt(match[4]) : 0;
    const minute = match[5] ? parseInt(match[5]) : 0;
    const second = match[6] ? parseInt(match[6]) : 0;
    return new Date(year, month, day, hour, minute, second);
  }
  return new Date(str);
}

export function isSameDay(dateStr: string, targetDate: Date) {
  const d = parseESDate(dateStr);
  return d.getDate() === targetDate.getDate() &&
         d.getMonth() === targetDate.getMonth() &&
         d.getFullYear() === targetDate.getFullYear();
}

export function getTodayMX() {
  const tjDateStr = new Date().toLocaleString('es-MX', { 
    timeZone: 'America/Tijuana',
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const parts = tjDateStr.split(',')[0].split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date();
}

export function getCurrentDateTimeTJ() {
  return new Date().toLocaleString('es-MX', {
    timeZone: 'America/Tijuana',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
