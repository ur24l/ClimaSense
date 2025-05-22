
import type { CurrentWeatherData, ForecastResponse, WeatherConditionKey } from '@/types/weather';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock weather conditions mapping
const conditions: WeatherConditionKey[] = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'];
const icons = {
  Clear: '01d', Clouds: '03d', Rain: '10d', Snow: '13d', Thunderstorm: '11d', Drizzle: '09d', Mist: '50d'
};

const getRandomCondition = (): WeatherConditionKey => conditions[Math.floor(Math.random() * conditions.length)];

function getMockIconCode(condition: WeatherConditionKey, isDay: boolean = true): string {
  const baseIcon = icons[condition] || (isDay ? '01d' : '01n');
  return isDay ? baseIcon.replace('n', 'd') : baseIcon.replace('d', 'n');
}


export async function fetchCurrentWeather(
  cityOrCoords: string | { lat: number; lon: number }
): Promise<CurrentWeatherData> {
  await delay(800); // Simulate network latency

  let cityName: string;
  let displayCityName: string;

  if (typeof cityOrCoords === 'string') {
    cityName = cityOrCoords;
    if (cityName.toLowerCase() === 'error') {
      throw new Error('Failed to fetch weather data for this city.');
    }
    displayCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  } else {
    // It's coordinates
    cityName = "Your Location"; // Internal identifier if needed
    displayCityName = "Your Location"; // Display name for detected location
    // Here you could potentially use lat/lon to vary mock data if desired
  }
  
  const now = Math.floor(Date.now() / 1000);
  const conditionKey = getRandomCondition();
  // Simplistic day check, assumes local time for mock sunrise/sunset is relevant for icon
  const localNow = new Date();
  const localHour = localNow.getHours();
  const isDay = localHour >= 6 && localHour < 18;


  return {
    city: displayCityName,
    temperature: Math.floor(Math.random() * 35) + 5, // Temp between 5 and 40
    feelsLike: Math.floor(Math.random() * 35) + 5,
    humidity: Math.floor(Math.random() * 70) + 30, // Humidity 30-100%
    windSpeed: Math.floor(Math.random() * 20) + 5, // Wind speed 5-25 km/h
    conditionKey,
    description: `${conditionKey} conditions observed.`,
    iconCode: getMockIconCode(conditionKey, isDay),
    dt: now,
    sunrise: now - 6 * 3600, // Mock sunrise 6 hours ago (relative to current UTC)
    sunset: now + 6 * 3600,  // Mock sunset 6 hours from now (relative to current UTC)
    timezoneOffset: -new Date().getTimezoneOffset() * 60, // User's browser's local timezone offset from UTC in seconds
  };
}

export async function fetchForecast(
  cityOrCoords: string | { lat: number; lon: number }
): Promise<ForecastResponse> {
  await delay(1000);

  let effectiveCityName: string;
  if (typeof cityOrCoords === 'string') {
    effectiveCityName = cityOrCoords;
    if (effectiveCityName.toLowerCase() === 'errorforecast') {
      throw new Error('Failed to fetch forecast data.');
    }
  } else {
    effectiveCityName = "Your Location"; // Placeholder for forecast context
  }

  const hourly: ForecastResponse['hourly'] = [];
  const daily: ForecastResponse['daily'] = [];
  const now = Math.floor(Date.now() / 1000);
  const browserTimezoneOffset = -new Date().getTimezoneOffset() * 60;


  // Mock 24 hours of hourly forecast
  for (let i = 0; i < 24; i++) {
    const hourlyDt = now + i * 3600;
    const conditionKey = getRandomCondition();
    // Determine if it's day time at the location for icon (using browser's offset as a proxy)
    const localHourForIcon = new Date((hourlyDt + browserTimezoneOffset) * 1000).getUTCHours();
    const isDayTime = localHourForIcon >= 6 && localHourForIcon < 18;
    hourly.push({
      dt: hourlyDt,
      temperature: Math.floor(Math.random() * 15) + 10, // Temp variation
      conditionKey,
      iconCode: getMockIconCode(conditionKey, isDayTime),
      pop: Math.random(),
    });
  }

  // Mock 7 days of daily forecast
  for (let i = 0; i < 7; i++) {
    const dailyDt = now + i * 24 * 3600;
    const conditionKey = getRandomCondition();
    daily.push({
      dt: dailyDt,
      tempMin: Math.floor(Math.random() * 10) + 5,
      tempMax: Math.floor(Math.random() * 10) + 15,
      conditionKey,
      iconCode: getMockIconCode(conditionKey, true), // Assume day for daily icons for simplicity
      sunrise: dailyDt + 6 * 3600, // Mock relative to day's start
      sunset: dailyDt + 18 * 3600, // Mock relative to day's start
      pop: Math.random(),
      humidity: Math.floor(Math.random() * 50) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5,
    });
  }

  return { hourly, daily };
}
