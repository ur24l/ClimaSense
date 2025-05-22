// WeatherWise: src/ai/flows/weather-insights.ts
'use server';

/**
 * @fileOverview AI-powered weather insights flow.
 *
 * This file defines a Genkit flow that takes weather data as input and
 * generates human-readable insights, including a summary, mood, and clothing recommendations.
 *
 * @module src/ai/flows/weather-insights
 *
 * @public
 *
 * @interface WeatherInsightsInput
 * @interface WeatherInsightsOutput
 * @function getWeatherInsights
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @interface WeatherInsightsInput
 * @description The input schema for the weather insights flow.
 * @property {string} city - The city to get weather insights for.
 * @property {string} weatherData - The current weather data for the city.
 */
const WeatherInsightsInputSchema = z.object({
  city: z.string().describe('The city to get weather insights for.'),
  weatherData: z.string().describe('The current weather data for the city.'),
});
export type WeatherInsightsInput = z.infer<typeof WeatherInsightsInputSchema>;

/**
 * @interface WeatherInsightsOutput
 * @description The output schema for the weather insights flow.
 * @property {string} summary - A summary of the current weather conditions.
 * @property {string} mood - The general mood associated with the current weather.
 * @property {string} clothingRecommendation - A recommendation for what to wear based on the current weather.
 */
const WeatherInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the current weather conditions.'),
  mood: z.string().describe('The general mood associated with the current weather.'),
  clothingRecommendation: z
    .string()
    .describe('A recommendation for what to wear based on the current weather.'),
});
export type WeatherInsightsOutput = z.infer<typeof WeatherInsightsOutputSchema>;

/**
 * @function getWeatherInsights
 * @description A wrapper function that calls the weatherInsightsFlow.
 * @param {WeatherInsightsInput} input - The input for the weatherInsightsFlow.
 * @returns {Promise<WeatherInsightsOutput>} - The output from the weatherInsightsFlow.
 */
export async function getWeatherInsights(
  input: WeatherInsightsInput
): Promise<WeatherInsightsOutput> {
  return weatherInsightsFlow(input);
}

const weatherInsightsPrompt = ai.definePrompt({
  name: 'weatherInsightsPrompt',
  input: {schema: WeatherInsightsInputSchema},
  output: {schema: WeatherInsightsOutputSchema},
  prompt: `You are a helpful weather assistant. Given the current weather data for a city, you will provide a summary of the weather, the general mood associated with the weather, and a clothing recommendation.

City: {{{city}}}
Weather Data: {{{weatherData}}}

Summary:
Mood:
Clothing Recommendation:`, 
});

const weatherInsightsFlow = ai.defineFlow(
  {
    name: 'weatherInsightsFlow',
    inputSchema: WeatherInsightsInputSchema,
    outputSchema: WeatherInsightsOutputSchema,
  },
  async input => {
    const {output} = await weatherInsightsPrompt(input);
    return output!;
  }
);
