import type { HourlyForecastData } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon';
import { Card, CardContent } from '@/components/ui/card';
import { formatTimestampToTime } from '@/lib/utils';
import { Droplets } from 'lucide-react';

interface HourlyForecastItemProps {
  item: HourlyForecastData;
  timezoneOffset: number;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({ item, timezoneOffset }) => {
  return (
    <Card className="flex-shrink-0 w-28 bg-app-card-bg/80 text-app-card-text text-center shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg">
      <CardContent className="p-3 space-y-1">
        <p className="text-sm font-medium">{formatTimestampToTime(item.dt, timezoneOffset)}</p>
        <WeatherIcon iconCode={item.iconCode} conditionKey={item.conditionKey} size={36} className="mx-auto text-accent" />
        <p className="text-lg font-semibold">{Math.round(item.temperature)}°C</p>
        {item.pop > 0.1 && ( // Show precipitation probability if > 10%
          <div className="flex items-center justify-center text-xs text-muted-foreground space-x-1">
            <Droplets size={12} />
            <span>{Math.round(item.pop * 100)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HourlyForecastItem;
