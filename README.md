
# ClimaSense 🌦️✨

**Don't just check the weather, _feel_ it. Get AI-powered insights, personalized recommendations, and the true 'vibe' of your day, in real-time.**

Hey there, future weather wizard! Welcome to ClimaSense, your friendly neighborhood weather app with a sprinkle of AI magic.

## What is ClimaSense? 🤔

ClimaSense is a web application that shows you the current weather, hourly and daily forecasts for any city you search for. But it's not just about numbers! It also tries to detect your current location automatically to give you instant weather info.

The really cool part? We use Artificial Intelligence (AI) to give you fun and useful insights like:
*   A quick summary of the weather.
*   The general "mood" or vibe the weather gives off.
*   A suggestion on what you might want to wear!

Plus, the app's theme changes dynamically based on the current weather conditions – pretty neat, huh?

## Cool Features! 🚀

*   **Real-time Weather**: Get up-to-date weather information for any city.
*   **Automatic Location Detection**: On opening the app, it tries to find your current location to show local weather.
    *   If you don't want to share, or if it can't find you, it defaults to showing weather for Vizag.
*   **Detailed Forecasts**:
    *   **Hourly Forecast**: See what the weather will be like hour-by-hour for the next 24 hours.
    *   **Daily Forecast**: Plan ahead with a 7-day weather forecast.
*   **AI-Powered Insights (via Genkit)**:
    *   **Weather Summary**: A quick, easy-to-understand summary.
    *   **Weather Mood**: Is it a gloomy day or a perfect day for a picnic? The AI will tell you!
    *   **Clothing Recommendations**: "Should I wear a jacket today?" ClimaSense has got your back.
*   **Dynamic Themes**: The app's background and colors change to match the current weather (e.g., sunny, rainy, cloudy).
*   **User-Friendly Interface**: Designed to be easy and intuitive to use!
*   **Loading Skeletons**: Smooth loading experience while data is being fetched.
*   **Toast Notifications**: Helpful pop-up messages for things like location detection or errors.

## Tech Stack 💻

This project is built with some modern and cool technologies:

*   **Next.js**: A powerful React framework (we're using the App Router and Server Components).
*   **React**: For building the user interface.
*   **TypeScript**: For safer and more robust JavaScript code.
*   **ShadCN UI**: A fantastic collection of pre-built UI components.
*   **Tailwind CSS**: For styling the app and making it look good quickly.
*   **Genkit (by Google)**: Powers our AI features, helping us generate those weather insights.
*   **Lucide Icons**: For crisp and clean icons throughout the app.

## Getting Started 🏁

Ready to dive in? Here's how you get ClimaSense running on your local machine.

1.  **Clone the Repository (If you haven't already)**:
    If you're working in Firebase Studio, the code is already there for you! If you downloaded it, make sure you're in the project directory.

2.  **Install Dependencies**:
    This project uses `npm` (Node Package Manager) to manage its bits and pieces (called dependencies). Open your terminal or command prompt in the project's root folder and run:
    ```bash
    npm install
    ```
    This command reads the `package.json` file and downloads all the necessary libraries.

3.  **Environment Variables (.env file)**:
    This project uses a `.env` file for API keys or other secret stuff. For ClimaSense, the Genkit setup for Google AI (Gemini) might need an API key.
    *   Make a copy of `.env.example` (if it exists) and rename it to `.env`.
    *   Fill in any required API keys. For the current mock setup, you might not need one immediately, but it's good practice for when you connect to real APIs.
    *   Currently, `GOOGLE_API_KEY` would be used by Genkit if you're using the Google AI plugin. Make sure it's set in your `.env` file if you're running Genkit with a real API key.
    ```env
    # Example .env file content:
    # GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY_HERE
    ```

## Running the App 🏃‍♀️💨

You'll usually need to run two things separately:
1.  The Next.js frontend (the website itself).
2.  The Genkit development server (for the AI parts).

### 1. Running the Next.js Frontend:

To start the main application (the part you see in your browser), run:

```bash
npm run dev
```

This will usually start the app on `http://localhost:9002` (the port `9002` is specified in your `package.json`). Open this URL in your web browser, and you should see ClimaSense!

### 2. Running the Genkit Development Server:

Genkit is used for the AI insights. To run the Genkit development server, which lets you see logs for your AI flows and manage them, open a *new* terminal window/tab (keep the Next.js one running!) and run:

```bash
npm run genkit:dev
```
Or, if you want it to automatically restart when you change AI flow files:
```bash
npm run genkit:watch
```
This usually starts the Genkit developer UI on `http://localhost:4000`. You can open this in your browser to see your defined flows (like `weatherInsightsFlow`).

**Why run Genkit separately?**
Genkit flows can be called by your Next.js app. Running `genkit:dev` or `genkit:watch` gives you a dedicated environment to test, debug, and trace your AI functionalities. When your Next.js app calls a Genkit flow, you'll see activity in the Genkit terminal and its Dev UI.

## How It Kinda Works (Simplified) ⚙️

1.  **You Visit the Page**: Your browser loads the ClimaSense app.
2.  **Location Check**: The app tries to get your current location.
    *   **Success?** Great! It fetches weather for where you are.
    *   **Fail/Denied?** No worries! It fetches weather for "Vizag" (our default city).
3.  **Weather Data**: The app calls a (currently mock) weather API to get current weather, hourly, and daily forecasts.
4.  **AI Magic Time**:
    *   The current weather data and city name are sent to a Genkit AI flow (`weatherInsightsFlow`).
    *   This flow uses a large language model (like Gemini) to analyze the weather and come up with:
        *   A summary.
        *   The "mood".
        *   A clothing suggestion.
5.  **Display!**: All this information (weather data + AI insights) is shown to you in a nice, user-friendly interface. The app's theme also updates to match the weather!

And that's ClimaSense in a nutshell! Feel free to explore the code, try making changes, and have fun! If you have questions, just ask. 😊
