"use client";

import * as React from 'react';
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastTabs from '@/components/ForecastTabs';
import WeatherInsightsCard from '@/components/WeatherInsightsCard';
import DynamicThemeManager from '@/components/DynamicThemeManager';
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather-api';
import type { CurrentWeatherData, ForecastResponse } from '@/types/weather';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThermometerSun } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function WeatherPage() {
  const [city, setCity] = React.useState<string | null>(null);
  const [currentWeather, setCurrentWeather] = React.useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = React.useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const defaultCity = "London"; // Default city to load on initial render

  React.useEffect(() => {
    handleSearch(defaultCity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load default city on mount

  const handleSearch = async (searchedCity: string) => {
    if (!searchedCity) return;

    setIsLoading(true);
    setError(null);
    setCurrentWeather(null); // Clear previous data
    setForecast(null);     // Clear previous data
    setCity(searchedCity);

    try {
      const [weatherResult, forecastResult] = await Promise.all([
        fetchCurrentWeather(searchedCity),
        fetchForecast(searchedCity)
      ]);
      setCurrentWeather(weatherResult);
      setForecast(forecastResult);
      toast({
        title: "Weather Updated",
        description: `Displaying weather for ${weatherResult.city}.`,
      });
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setCurrentWeather(null);
      setForecast(null);
      toast({
        variant: "destructive",
        title: "Error Fetching Weather",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DynamicThemeManager weatherData={currentWeather} />
      <div className="min-h-screen flex flex-col items-center p-4 md:p-8 space-y-6 bg-app-bg text-app-text">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-app-header-text flex items-center justify-center">
            <ThermometerSun size={48} className="mr-3 text-primary" /> WeatherWise
          </h1>
          <p className="text-muted-foreground text-lg">Your intelligent weather companion.</p>
        </header>

        <WeatherSearch onSearch={handleSearch} isLoading={isLoading} initialCity={defaultCity} />

        {error && (
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Container for weather cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Current Weather and AI Insights on one side for larger screens */}
          <div className="space-y-6 w-full md:max-w-md mx-auto md:mx-0">
            {(isLoading || currentWeather) && (
                <CurrentWeatherCard data={currentWeather} isLoading={isLoading && !currentWeather} />
            )}
            {(isLoading || (city && currentWeather)) && (
                <WeatherInsightsCard city={city} currentWeather={currentWeather} isLoadingTrigger={isLoading && !currentWeather} />
            )}
          </div>
          
          {/* Forecast on the other side for larger screens, or below on smaller */}
           {(isLoading || forecast) && (
            <div className="w-full md:row-start-1 md:col-start-2"> {/* Adjust grid positioning for md screens */}
                 <ForecastTabs data={forecast} isLoading={isLoading && !forecast} timezoneOffset={currentWeather?.timezoneOffset ?? 0} />
            </div>
           )}
        </div>

        {/* Initial placeholder when nothing is searched yet (after default load attempt) */}
        {!isLoading && !currentWeather && !error && city === null && (
          <div className="text-center text-muted-foreground mt-10">
            <p className="text-xl">Search for a city to get started!</p>
          </div>
        )}
      </div>
    </>
  );
}
