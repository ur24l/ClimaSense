"use client";

import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  initialCity?: string;
}

const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch, isLoading, initialCity = "" }) => {
  const [cityInput, setCityInput] = React.useState(initialCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onSearch(cityInput.trim());
    }
  };
  
  React.useEffect(() => {
    if(initialCity){
        setCityInput(initialCity);
    }
  }, [initialCity])

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter city name..."
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        className="flex-grow bg-card text-card-foreground border-border focus:ring-primary"
        aria-label="City search input"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading} variant="outline" className="border-primary text-primary hover:bg-primary/10">
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Search className="h-5 w-5" />
        )}
        <span className={isLoading ? "ml-2" : "sr-only"}>{isLoading ? "Searching..." : "Search"}</span>
      </Button>
    </form>
  );
};

export default WeatherSearch;
