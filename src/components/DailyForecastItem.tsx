import type { DailyForecastData } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon';
import { Card, CardContent } from '@/components/ui/card';
import { formatTimestampToDate } from '@/lib/utils';
import { Droplets } from 'lucide-react';

interface DailyForecastItemProps {
  item: DailyForecastData;
  timezoneOffset: number;
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({ item, timezoneOffset }) => {
  return (
    <Card className="bg-app-card-bg/80 text-app-card-text shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg">
      <CardContent className="p-4 flex items-center justify-between space-x-3">
        <div className="flex-1 space-y-0.5">
          <p className="text-sm font-semibold">{formatTimestampToDate(item.dt, timezoneOffset, 'EEE, MMM d')}</p>
          <p className="text-xs text-muted-foreground">{item.conditionKey}</p>
           {item.pop > 0.1 && (
            <div className="flex items-center text-xs text-blue-500 space-x-1">
              <Droplets size={12} />
              <span>{Math.round(item.pop * 100)}%</span>
            </div>
          )}
        </div>
        <WeatherIcon iconCode={item.iconCode} conditionKey={item.conditionKey} size={40} className="text-accent" />
        <div className="text-right">
          <p className="text-md font-semibold">{Math.round(item.tempMax)}°C</p>
          <p className="text-sm text-muted-foreground">{Math.round(item.tempMin)}°C</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyForecastItem;
