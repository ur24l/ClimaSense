import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CurrentWeatherData } from "@/types/weather";
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeatherDataForAI(data: CurrentWeatherData): string {
  return `City: ${data.city}, Temperature: ${data.temperature}°C, Feels like: ${data.feelsLike}°C, Condition: ${data.description}, Humidity: ${data.humidity}%, Wind: ${data.windSpeed} km/h.`;
}

export function formatTimestampToTime(timestamp: number, timezoneOffset: number, fmt: string = 'p'): string {
  // Adjust timestamp by timezoneOffset to get local time for that location
  // Date constructor expects milliseconds
  const date = new Date((timestamp + timezoneOffset) * 1000);
  // format function uses system's local timezone by default for formatting.
  // To show the time *at the location*, we've already adjusted 'date' to be effectively UTC equivalent of local time.
  // So, we format it as if it's UTC to get the correct local hour/minute strings.
  // This is a common trick if date-fns-tz is not used.
  // For a robust solution, date-fns-tz and proper IANA timezone names would be better.
  // However, with just an offset, this is a common approach.
  // Let's re-evaluate this, format uses local timezone. We want to display *their* local time.
  const localDate = new Date(timestamp * 1000 + timezoneOffset * 1000);
  // We need to make sure format uses UTC interpretation to print hours/minutes correctly
  // as localDate is already "their local time expressed in UTC".
  // A simpler way for this specific case:
  const locationDate = new Date(timestamp * 1000); // Original date
  // Use toLocaleTimeString with a specified timeZone (if available) or format based on offset.
  // For simplicity with just offset:
  
  // Create a date object that represents UTC time
  const utcDate = new Date(timestamp * 1000);
  // Apply the offset to this UTC date to get the correct local time at the location
  const locationSpecificDate = new Date(utcDate.getTime() + timezoneOffset * 1000);

  // Now format this date. We must tell `format` to treat this date as UTC,
  // because its internal values are already representing the target locale's time.
  const year = locationSpecificDate.getUTCFullYear();
  const month = locationSpecificDate.getUTCMonth(); // 0-indexed
  const day = locationSpecificDate.getUTCDate();
  const hours = locationSpecificDate.getUTCHours();
  const minutes = locationSpecificDate.getUTCMinutes();
  const seconds = locationSpecificDate.getUTCSeconds();
  
  // Reconstruct a date that date-fns format will interpret correctly for 'p' or 'Pp'
  // This is essentially creating a date in the system's local timezone that has the same clock reading
  // as the target location.
  const displayDate = new Date();
  displayDate.setFullYear(year, month, day);
  displayDate.setHours(hours, minutes, seconds, 0);

  return format(displayDate, fmt);
}

export function formatTimestampToDate(timestamp: number, timezoneOffset: number, fmt: string = 'MMM d'): string {
   // Similar logic as formatTimestampToTime
  const utcDate = new Date(timestamp * 1000);
  const locationSpecificDate = new Date(utcDate.getTime() + timezoneOffset * 1000);

  const year = locationSpecificDate.getUTCFullYear();
  const month = locationSpecificDate.getUTCMonth();
  const day = locationSpecificDate.getUTCDate();
  
  const displayDate = new Date();
  displayDate.setFullYear(year, month, day);
  displayDate.setHours(0,0,0,0); // Ensure time part doesn't affect date formatting

  return format(displayDate, fmt);
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
