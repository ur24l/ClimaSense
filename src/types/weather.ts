export type WeatherConditionKey =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Drizzle'
  | 'Snow'
  | 'Thunderstorm'
  | 'Mist'
  | 'Smoke'
  | 'Haze'
  | 'Dust'
  | 'Fog'
  | 'Sand'
  | 'Ash'
  | 'Squall'
  | 'Tornado';

export interface CurrentWeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  conditionKey: WeatherConditionKey;
  description: string;
  iconCode: string; // e.g., OpenWeatherMap icon code
  dt: number; // UNIX timestamp for current data
  sunrise: number; // UNIX timestamp
  sunset: number; // UNIX timestamp
  timezoneOffset: number; // Offset in seconds from UTC
}

export interface HourlyForecastData {
  dt: number; // UNIX timestamp
  temperature: number;
  conditionKey: WeatherConditionKey;
  iconCode: string;
  pop: number; // Probability of precipitation
}

export interface DailyForecastData {
  dt: number; // UNIX timestamp for the day
  tempMin: number;
  tempMax: number;
  conditionKey: WeatherConditionKey;
  iconCode: string;
  sunrise: number; // UNIX timestamp
  sunset: number; // UNIX timestamp
  pop: number; // Probability of precipitation
  humidity: number;
  windSpeed: number;
}

export interface ForecastResponse {
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
}

// Simplified type for what OpenWeatherMap might return for current weather
export interface OpenWeatherCurrentResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string; // This should map to WeatherConditionKey
    description: string;
    icon: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number; // Shift in seconds from UTC
}

// Simplified type for what OpenWeatherMap One Call API might return for forecast
export interface OpenWeatherForecastResponse {
  hourly: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      main: string;
      icon: string;
    }>;
    pop: number;
  }>;
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
    pop: number;
    humidity: number;
    wind_speed: number;
  }>;
  timezone_offset: number; // Shift in seconds from UTC
}
