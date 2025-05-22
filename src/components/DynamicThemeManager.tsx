"use client";

import * as React from 'react';
import type { CurrentWeatherData, WeatherConditionKey } from '@/types/weather';

interface DynamicThemeManagerProps {
  weatherData: CurrentWeatherData | null;
}

function getThemeClass(weather: CurrentWeatherData | null): string {
  if (!weather) return '';

  const { conditionKey, dt, sunrise, sunset } = weather;
  const currentTime = dt;
  
  // Determine if it's day or night
  // Ensure sunrise and sunset are valid and make sense relative to current time
  // A simple check: if current time is between sunrise and sunset, it's day.
  // This needs to handle cases where sunrise/sunset might be on different calendar days (e.g. polar regions, or just midnight rollover)
  // For simplicity, assuming sunrise < sunset on the same day for this check.
  let isDay = true; // Default to day
  if (sunrise && sunset && sunrise < sunset) { // Basic check
      isDay = currentTime >= sunrise && currentTime < sunset;
  } else if (sunrise && sunset && sunrise > sunset) { // Handles cases like sunset past midnight, sunrise early morning
      isDay = currentTime >= sunrise || currentTime < sunset; // Day if after sunrise OR before sunset (of next day)
  }


  // Base theme class on condition and time of day
  switch (conditionKey) {
    case 'Clear':
      return isDay ? 'theme-clear-day' : 'theme-clear-night';
    case 'Clouds':
      return isDay ? 'theme-cloudy-day' : 'theme-cloudy-night';
    case 'Rain':
    case 'Drizzle':
      return 'theme-rainy';
    case 'Snow':
      return 'theme-snowy';
    case 'Thunderstorm':
      return 'theme-stormy';
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado':
      return isDay ? 'theme-cloudy-day' : 'theme-cloudy-night'; // Default to cloudy for these
    default:
      return isDay ? 'theme-clear-day' : 'theme-clear-night'; // Default theme
  }
}

const DynamicThemeManager: React.FC<DynamicThemeManagerProps> = ({ weatherData }) => {
  React.useEffect(() => {
    const themeClass = getThemeClass(weatherData);
    
    // Remove any existing theme classes
    document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
    
    if (themeClass) {
      document.body.classList.add(themeClass);
    }

    // Cleanup function to remove class when component unmounts or weatherData is null
    return () => {
      if (themeClass) {
        document.body.classList.remove(themeClass);
      }
    };
  }, [weatherData]);

  return null; // This component does not render anything itself
};

export default DynamicThemeManager;
