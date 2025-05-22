import type { CurrentWeatherData } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import WeatherIcon, { Thermometer, Wind, Droplets, Sunrise as SunriseIcon, Sunset as SunsetIcon } from '@/components/WeatherIcon';
import { formatTimestampToTime } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

interface CurrentWeatherCardProps {
  data: CurrentWeatherData | null;
  isLoading: boolean;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md bg-app-card-bg text-app-card-text shadow-lg rounded-xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-12 w-24" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="w-full max-w-md bg-app-card-bg text-app-card-text shadow-lg rounded-xl overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader className="bg-primary/10 p-6">
        <CardTitle className="text-3xl font-bold text-primary">{data.city}</CardTitle>
        <CardDescription className="text-primary/80">
          {new Date(data.dt * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <WeatherIcon iconCode={data.iconCode} conditionKey={data.conditionKey} size={80} className="text-accent" />
          <p className="text-5xl font-bold">{Math.round(data.temperature)}°C</p>
          <p className="text-lg text-muted-foreground">{data.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-accent" />
            <span>Feels like: {Math.round(data.feelsLike)}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-accent" />
            <span>Humidity: {data.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-accent" />
            <span>Wind: {data.windSpeed.toFixed(1)} km/h</span>
          </div>
           <div className="flex items-center space-x-2">
            <SunriseIcon className="w-5 h-5 text-accent" />
            <span>Sunrise: {formatTimestampToTime(data.sunrise, data.timezoneOffset)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <SunsetIcon className="w-5 h-5 text-accent" />
            <span>Sunset: {formatTimestampToTime(data.sunset, data.timezoneOffset)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeatherCard;
