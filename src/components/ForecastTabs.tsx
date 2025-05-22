import type { ForecastResponse } from '@/types/weather';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import HourlyForecastItem from './HourlyForecastItem';
import DailyForecastItem from './DailyForecastItem';
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CalendarDays } from 'lucide-react';

interface ForecastTabsProps {
  data: ForecastResponse | null;
  isLoading: boolean;
  timezoneOffset: number;
}

const ForecastTabs: React.FC<ForecastTabsProps> = ({ data, isLoading, timezoneOffset }) => {
  if (isLoading) {
    return (
      <Card className="w-full bg-app-card-bg text-app-card-text shadow-lg rounded-xl">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hourly">
            <TabsList className="grid w-full grid-cols-2 bg-primary/5">
              <TabsTrigger value="hourly" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Clock className="mr-2 h-4 w-4" /> Hourly
              </TabsTrigger>
              <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <CalendarDays className="mr-2 h-4 w-4" /> Daily
              </TabsTrigger>
            </TabsList>
            <TabsContent value="hourly" className="mt-4">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-4">
                  {[...Array(5)].map((_, i) => (
                     <Card key={i} className="flex-shrink-0 w-28">
                        <CardContent className="p-3 space-y-1">
                            <Skeleton className="h-4 w-16 mx-auto" />
                            <Skeleton className="h-9 w-9 mx-auto rounded-full mt-1" />
                            <Skeleton className="h-5 w-12 mx-auto mt-1" />
                            <Skeleton className="h-3 w-10 mx-auto mt-1" />
                        </CardContent>
                     </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="daily" className="mt-4 space-y-2">
               {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  if (!data || (!data.hourly?.length && !data.daily?.length)) return null;

  return (
    <Card className="w-full bg-app-card-bg text-app-card-text shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-app-header-text">Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hourly">
          <TabsList className="grid w-full grid-cols-2 bg-primary/5">
            <TabsTrigger value="hourly" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary focus-visible:ring-ring">
               <Clock className="mr-2 h-4 w-4" /> Hourly
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary focus-visible:ring-ring">
              <CalendarDays className="mr-2 h-4 w-4" /> Daily
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="mt-4">
            {data.hourly && data.hourly.length > 0 ? (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-4">
                  {data.hourly.map((item, index) => (
                    <HourlyForecastItem key={index} item={item} timezoneOffset={timezoneOffset} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : <p className="text-center text-muted-foreground py-4">Hourly forecast not available.</p>}
          </TabsContent>

          <TabsContent value="daily" className="mt-4 space-y-2">
            {data.daily && data.daily.length > 0 ? (
              data.daily.map((item, index) => (
                <DailyForecastItem key={index} item={item} timezoneOffset={timezoneOffset} />
              ))
            ) : <p className="text-center text-muted-foreground py-4">Daily forecast not available.</p>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ForecastTabs;
