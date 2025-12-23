import { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge } from 'lucide-react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3000/weather/${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather');
      }
      
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const getWeatherIcon = (condition) => {
    const lower = condition?.toLowerCase() || '';
    if (lower.includes('rain')) return <CloudRain className="w-16 h-16" />;
    if (lower.includes('cloud')) return <Cloud className="w-16 h-16" />;
    return <Sun className="w-16 h-16" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Pratik's Weather Forecast
          </h1>
          
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-200"
              />
              <button
                onClick={fetchWeather}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Loading...' : 'Search'}     
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {weather && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">
                  {weather.name}, {weather.country}
                </h2>
                <div className="flex justify-center text-gray-200 mb-4">
                  {getWeatherIcon(weather.condition)}
                </div>
                <div className="text-5xl font-bold text-gray-200 mb-2">
                  {Math.round(weather.temperature)}°C
                </div>
                <div className="text-xl text-gray-200 capitalize">
                  {weather.condition}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 text-white border-2">
                  <div className="flex items-center gap-2 text-gray-50 mb-1">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-50">
                    {weather.humidity}%
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border-2 text-white">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Wind className="w-4 h-4" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <div className="text-2xl font-semibold text-white">
                    {weather.windSpeed} m/s
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border-2 text-white">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Gauge className="w-4 h-4" />
                    <span className="text-sm">Pressure</span>
                  </div>
                  <div className="text-2xl font-semibold text-white">
                    {weather.pressure} hPa
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 text-white border-2">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <div className="text-2xl font-semibold text-white">
                    {(weather.visibility / 1000).toFixed(1)} km
                  </div>
                </div>
              </div>

              {/* <div className="bg-gradient-linear-r from-blue-800 to-blue-600 rounded-xl p-4 text-white"> */}
                <div className='bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 p-5 rounded-3xl text-white justify-center items-center'>
                <div className="text-sm opacity-90 mb-1">Feels Like</div>
                <div className="text-3xl font-bold">
                  {Math.round(weather.feelsLike)}°C
                </div>
              </div>
            </div>
          )}

          {!weather && !error && (
            <div className="text-center text-gray-500 py-8">
              <Cloud className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter a city name to get weather information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}