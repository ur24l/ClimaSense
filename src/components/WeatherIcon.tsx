import type { WeatherConditionKey } from '@/types/weather';
import {
  Sun, Cloud, CloudRain, CloudDrizzle, Snowflake, CloudLightning, CloudFog, Thermometer, Wind, Droplets, Sunrise, Sunset, Gauge, Zap, CloudSun, CloudMoon, TornadoIcon, CloudSunRain, CloudMoonRain, Cloudy
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps extends LucideProps {
  conditionKey?: WeatherConditionKey;
  iconCode?: string; // OpenWeatherMap icon code, e.g., "01d", "10n"
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ conditionKey, iconCode, size = 24, className, ...props }) => {
  let IconComponent;

  if (iconCode) {
    // Mapping based on OpenWeatherMap icon codes
    // See: https://openweathermap.org/weather-conditions
    const mainPart = iconCode.substring(0, 2);
    const dayNight = iconCode.substring(2);

    switch (mainPart) {
      case '01': IconComponent = (dayNight === 'd' ? Sun : CloudMoon); break; // Clear sky
      case '02': IconComponent = (dayNight === 'd' ? CloudSun : CloudMoon); break; // Few clouds
      case '03': IconComponent = Cloud; break; // Scattered clouds
      case '04': IconComponent = Cloudy; break; // Broken clouds / Overcast clouds
      case '09': IconComponent = CloudDrizzle; break; // Shower rain
      case '10': IconComponent = (dayNight === 'd' ? CloudSunRain : CloudMoonRain); break; // Rain
      case '11': IconComponent = CloudLightning; break; // Thunderstorm
      case '13': IconComponent = Snowflake; break; // Snow
      case '50': IconComponent = CloudFog; break; // Mist
      default: IconComponent = (dayNight === 'd' ? Sun : CloudMoon);
    }
  } else if (conditionKey) {
    // Fallback to conditionKey if iconCode is not provided
    switch (conditionKey) {
      case 'Clear': IconComponent = Sun; break;
      case 'Clouds': IconComponent = Cloud; break;
      case 'Rain': IconComponent = CloudRain; break;
      case 'Drizzle': IconComponent = CloudDrizzle; break;
      case 'Snow': IconComponent = Snowflake; break;
      case 'Thunderstorm': IconComponent = CloudLightning; break;
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Dust':
      case 'Fog':
      case 'Sand':
      case 'Ash':
        IconComponent = CloudFog; break;
      case 'Squall': IconComponent = Wind; break;
      case 'Tornado': IconComponent = TornadoIcon; break;
      default: IconComponent = Thermometer; // A generic fallback
    }
  } else {
    IconComponent = Thermometer; // Default if nothing provided
  }
  
  return <IconComponent size={size} className={cn("inline-block", className)} {...props} />;
};

// Exporting other useful icons for direct use
export { Thermometer, Wind, Droplets, Sunrise, Sunset, Gauge, Zap, Sun as SunIcon, CloudLightning as StormIcon };
export default WeatherIcon;
