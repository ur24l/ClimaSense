import { Skeleton } from "@/components/ui/skeleton";
import { ThermometerSun } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 space-y-6 bg-app-bg text-app-text">
      <header className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-app-header-text flex items-center justify-center">
          <ThermometerSun size={48} className="mr-3 text-primary animate-pulse" /> WeatherWise
        </h1>
        <p className="text-muted-foreground text-lg">Loading weather data...</p>
      </header>
      
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-full" /> {/* Search bar skeleton */}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-6">
        <div className="space-y-6 w-full md:max-w-md mx-auto md:mx-0">
          {/* Current Weather Card Skeleton */}
          <Skeleton className="h-80 w-full rounded-xl" />
          {/* AI Insights Card Skeleton */}
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        {/* Forecast Tabs Skeleton */}
        <Skeleton className="h-[500px] w-full rounded-xl md:row-start-1 md:col-start-2" />
      </div>
    </div>
  );
}
