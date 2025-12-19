import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function FarmerView() {
  const { user } = useSelector((state) => state.auth);
  
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [locationName, setLocationName] = useState('Detecting Location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          // Optional: Reverse geocoding could go here, but avoiding extra API keys for now
          setLocationName(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
        },
        (error) => {
          console.error("Location access denied:", error);
          // Default fallback location (e.g., Delhi, India)
          fetchWeatherData(28.61, 77.20);
          setLocationName("New Delhi (Default)");
        }
      );
    } else {
       fetchWeatherData(28.61, 77.20);
       setLocationName("New Delhi (Default)");
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
      try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
          const data = await response.json();
          
          setWeather({
              temp: Math.round(data.current.temperature_2m),
              humidity: data.current.relative_humidity_2m,
              wind: data.current.wind_speed_10m,
              code: data.current.weather_code,
              isDay: data.current.is_day
          });
          setLoadingWeather(false);
      } catch (error) {
          console.error("Failed to fetch weather:", error);
          setLoadingWeather(false);
      }
  };

  const getWeatherIcon = (code) => {
     // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
     if (code === 0) return '☀️'; // Clear sky
     if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
     if (code >= 45 && code <= 48) return '🌫️'; // Fog
     if (code >= 51 && code <= 67) return '🌧️'; // Drizzle/Rain
     if (code >= 71 && code <= 77) return '❄️'; // Snow
     if (code >= 95) return '⛈️'; // Thunderstorm
     return '🌡️';
  };

  const getWeatherDescription = (code) => {
     if (code === 0) return 'Clear Sky';
     if (code >= 1 && code <= 3) return 'Partly Cloudy';
     if (code >= 45 && code <= 48) return 'Foggy';
     if (code >= 51 && code <= 67) return 'Rainy';
     if (code >= 71 && code <= 77) return 'Snowy';
     if (code >= 95) return 'Thunderstorm';
     return 'Moderate';
  };

  return (
    <div className="pt-24 pb-12">
      {/* Welcome & Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Welcome Card */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border-l-8 border-green-500 bg-white/5 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl text-3xl">👨‍🌾</div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, Farmer {user ? user.name : ''}</h1>
               <p className="text-white/70 text-lg">
                Your crops depend on you. Use the tools below to protect your harvest.
              </p>
            </div>
          </div>
        </div>

        {/* Weather Widget (Open-Meteo Direct) */}
        <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex flex-col justify-between relative overflow-hidden group">
           {/* Animated Background Icon */}
           <div className="absolute -top-4 -right-4 p-4 opacity-10 text-9xl group-hover:rotate-12 transition duration-700">
              {weather ? getWeatherIcon(weather.code) : '⌛'}
           </div>
           
           <div className="relative z-10">
              <h3 className="text-white/80 font-medium mb-2 flex items-center gap-2">
                 📍 {locationName}
              </h3>

              {loadingWeather ? (
                  <div className="animate-pulse space-y-3">
                      <div className="h-10 w-24 bg-white/10 rounded"></div>
                      <div className="h-4 w-32 bg-white/10 rounded"></div>
                  </div>
              ) : (
                  <>
                    <div className="text-5xl font-bold text-white mb-1 flex items-center gap-3">
                        {weather?.temp}°C
                        <span className="text-4xl">{getWeatherIcon(weather?.code)}</span>
                    </div>
                    <p className="text-white/90 text-lg font-light tracking-wide">
                        {getWeatherDescription(weather?.code)}
                    </p>
                  </>
              )}
           </div>
           
           <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                 <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Humidity</p>
                 <p className="text-lg font-bold text-white">{weather?.humidity || '--'}%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                 <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Wind Speed</p>
                 <p className="text-lg font-bold text-white">{weather?.wind || '--'} <span className="text-xs font-normal">km/h</span></p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BIG BUTTON TO REPORT ISSUE */}
        <Link to="/report" className="group">
          <div className="glass-card p-10 rounded-3xl h-full flex flex-col justify-between hover:bg-white/10 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition duration-300">
                📝
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Report Outbreak</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Found pests in your field? Upload photos and location details to alert the community immediately.
              </p>
            </div>
            <div className="flex items-center text-green-400 font-bold text-lg group-hover:translate-x-2 transition duration-300">
              Start New Report →
            </div>
          </div>
        </Link>

        {/* View History */}
        <Link to="/my-reports" className="group">
          <div className="glass-card p-10 rounded-3xl h-full flex flex-col justify-between hover:bg-white/10 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition duration-300">
                📂
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">My Reports</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                 Track the status of your submitted reports and view admin feedback or resolutions.
              </p>
            </div>
             <div className="flex items-center text-blue-400 font-bold text-lg group-hover:translate-x-2 transition duration-300">
              View History →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default FarmerView;