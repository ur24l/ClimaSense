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


export async function fetchCurrentWeather(city: string): Promise<CurrentWeatherData> {
  await delay(800); // Simulate network latency

  if (city.toLowerCase() === 'error') {
    throw new Error('Failed to fetch weather data for this city.');
  }
  
  const now = Math.floor(Date.now() / 1000);
  const conditionKey = getRandomCondition();
  const isDay = now > (now - 12*60*60) && now < (now + 12*60*60); // Simplistic day check for icon

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temperature: Math.floor(Math.random() * 35) + 5, // Temp between 5 and 40
    feelsLike: Math.floor(Math.random() * 35) + 5,
    humidity: Math.floor(Math.random() * 70) + 30, // Humidity 30-100%
    windSpeed: Math.floor(Math.random() * 20) + 5, // Wind speed 5-25 km/h
    conditionKey,
    description: `${conditionKey} conditions with some details.`,
    iconCode: getMockIconCode(conditionKey, isDay),
    dt: now,
    sunrise: now - 6 * 3600, // Mock sunrise 6 hours ago
    sunset: now + 6 * 3600,  // Mock sunset 6 hours from now
    timezoneOffset: -new Date().getTimezoneOffset() * 60, // User's local timezone offset
  };
}

export async function fetchForecast(city: string): Promise<ForecastResponse> {
  await delay(1000);

  if (city.toLowerCase() === 'errorforecast') {
    throw new Error('Failed to fetch forecast data.');
  }

  const hourly: ForecastResponse['hourly'] = [];
  const daily: ForecastResponse['daily'] = [];
  const now = Math.floor(Date.now() / 1000);

  // Mock 24 hours of hourly forecast
  for (let i = 0; i < 24; i++) {
    const hourlyDt = now + i * 3600;
    const conditionKey = getRandomCondition();
    const localHour = new Date((hourlyDt + (-new Date().getTimezoneOffset()*60)) * 1000).getHours();
    const isDayTime = localHour >= 6 && localHour < 18;
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
      sunrise: dailyDt + 6 * 3600,
      sunset: dailyDt + 18 * 3600,
      pop: Math.random(),
      humidity: Math.floor(Math.random() * 50) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5,
    });
  }

  return { hourly, daily };
}
