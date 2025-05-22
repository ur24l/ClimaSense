
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
  const [isLoading, setIsLoading] = React.useState(true); // Start loading true for initial geo attempt
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const fallbackCity = "London";

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast({
            title: "Location Detected",
            description: "Fetching weather for your current location.",
          });
          handleSearch({ lat: latitude, lon: longitude });
        },
        (geoError) => {
          console.warn(`Geolocation error: ${geoError.message}`);
          toast({
            title: "Location Access Denied/Failed",
            description: `Could not get your location: ${geoError.message}. Showing weather for ${fallbackCity}.`,
            variant: "default", 
          });
          handleSearch(fallbackCity);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      toast({
        title: "Location Not Supported",
        description: `Geolocation is not supported by your browser. Showing weather for ${fallbackCity}.`,
      });
      handleSearch(fallbackCity);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount

  const handleSearch = async (searchParam: string | { lat: number; lon: number }) => {
    if (!searchParam) {
      setIsLoading(false); // Ensure loading is stopped if searchParam is invalid
      return;
    }

    setIsLoading(true);
    setError(null);
    // Don't clear city here, let it be set by the outcome or stay from previous successful search
    // setCurrentWeather(null); // Clear previous data
    // setForecast(null);     // Clear previous data
    
    let cityForDisplayUpdate: string;
    if (typeof searchParam === 'string') {
      cityForDisplayUpdate = searchParam;
    } else {
      cityForDisplayUpdate = "Your Location"; // Tentative display name
    }
    // Set city immediately for user feedback if it's a new text search or first time geo
    if (city !== cityForDisplayUpdate && typeof searchParam === 'string') {
      setCity(cityForDisplayUpdate);
    } else if (typeof searchParam !== 'string' && city !== "Your Location") {
      // Only set to "Your Location" if it's not already that (e.g. initial load)
      setCity("Your Location");
    }


    try {
      const [weatherResult, forecastResult] = await Promise.all([
        fetchCurrentWeather(searchParam),
        fetchForecast(searchParam)
      ]);
      
      setCurrentWeather(weatherResult);
      setForecast(forecastResult);
      setCity(weatherResult.city); // Update city state with resolved name from API
      
      if (typeof searchParam !== 'string' && weatherResult.city === "Your Location") {
        // No redundant toast if already shown for "Location Detected"
      } else {
        toast({
          title: "Weather Updated",
          description: `Displaying weather for ${weatherResult.city}.`,
        });
      }
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setCurrentWeather(null);
      setForecast(null);
      // City state remains what it was (e.g. "Your Location" or typed city) to show error context
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

        <WeatherSearch 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          initialCity={city || (isLoading && !city ? "Detecting location..." : fallbackCity)} 
        />

        {error && (
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6 w-full md:max-w-md mx-auto md:mx-0">
            {(isLoading || currentWeather) && (
                <CurrentWeatherCard data={currentWeather} isLoading={isLoading && !currentWeather && !error} />
            )}
            {/* Ensure city and currentWeather are present for insights, or it's loading */}
            {(isLoading || (city && currentWeather)) && (
                <WeatherInsightsCard city={city} currentWeather={currentWeather} isLoadingTrigger={isLoading && !currentWeather && !error} />
            )}
          </div>
          
           {(isLoading || forecast) && (
            <div className="w-full md:row-start-1 md:col-start-2">
                 <ForecastTabs data={forecast} isLoading={isLoading && !forecast && !error} timezoneOffset={currentWeather?.timezoneOffset ?? 0} />
            </div>
           )}
        </div>

        {/* Initial placeholder or if everything is null and not loading and no error */}
        {!isLoading && !currentWeather && !error && !city && (
          <div className="text-center text-muted-foreground mt-10">
            <p className="text-xl">Search for a city or allow location access.</p>
          </div>
        )}
      </div>
    </>
  );
}
