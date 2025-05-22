"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Shirt, Smile } from 'lucide-react';
import { getWeatherInsights, type WeatherInsightsOutput } from '@/ai/flows/weather-insights';
import type { CurrentWeatherData } from '@/types/weather';
import { formatWeatherDataForAI } from '@/lib/utils';

interface WeatherInsightsCardProps {
  city: string | null;
  currentWeather: CurrentWeatherData | null;
  isLoadingTrigger: boolean; // True when main weather data is loading
}

const WeatherInsightsCard: React.FC<WeatherInsightsCardProps> = ({ city, currentWeather, isLoadingTrigger }) => {
  const [insights, setInsights] = React.useState<WeatherInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (city && currentWeather && !isLoadingTrigger) {
      const fetchInsights = async () => {
        setIsLoadingInsights(true);
        setError(null);
        setInsights(null);
        try {
          const weatherDataString = formatWeatherDataForAI(currentWeather);
          const result = await getWeatherInsights({ city, weatherData: weatherDataString });
          setInsights(result);
        } catch (err) {
          console.error("Failed to fetch weather insights:", err);
          setError("Could not generate weather insights at this time.");
        } finally {
          setIsLoadingInsights(false);
        }
      };
      fetchInsights();
    } else if (!city || !currentWeather) {
      // Reset if city or weather data is cleared
      setInsights(null);
      setError(null);
      setIsLoadingInsights(false);
    }
  }, [city, currentWeather, isLoadingTrigger]);

  if (isLoadingTrigger) { // Show skeleton if main data is loading
     return (
      <Card className="w-full bg-app-card-bg text-app-card-text shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-app-header-text flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" /> AI Weather Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!city || !currentWeather) return null; // Don't render if no city/weather to analyze

  return (
    <Card className="w-full bg-app-card-bg text-app-card-text shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-app-header-text flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" /> AI Weather Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingInsights && (
          <>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><Lightbulb size={16} className="mr-2 text-accent" />Summary</h3>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><Smile size={16} className="mr-2 text-accent" />Mood</h3>
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><Shirt size={16} className="mr-2 text-accent" />What to Wear</h3>
              <Skeleton className="h-10 w-full" />
            </div>
          </>
        )}
        {error && !isLoadingInsights && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {insights && !isLoadingInsights && !error && (
          <>
            <div>
              <h3 className="text-md font-semibold mb-1 flex items-center text-primary"><Lightbulb size={18} className="mr-2" />Summary</h3>
              <p className="text-sm">{insights.summary}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-1 flex items-center text-primary"><Smile size={18} className="mr-2" />Mood</h3>
              <p className="text-sm">{insights.mood}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-1 flex items-center text-primary"><Shirt size={18} className="mr-2" />What to Wear</h3>
              <p className="text-sm">{insights.clothingRecommendation}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherInsightsCard;
