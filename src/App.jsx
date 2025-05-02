import { useState, useEffect } from "react";

function Card({ weatherData, error }) {
  if (error !== null) {
    return (
      <div className="text-center text-3xl mt-8 font-medium text-red-600 font-['Poppins','_sans-serif']">
        {error}. Please reload the page and try again.
      </div>
    );
  }
  if (!weatherData)
    return (
      <div className="text-center text-5xl mt-8 font-medium text-red-600 font-['Poppins','_sans-serif']">
        Loading...
      </div>
    );

  if (weatherData.status === "not_found" || weatherData.status === 400) {
    return (
      <div className="text-center text-5xl mt-8 font-medium text-red-600 font-['Poppins','_sans-serif']">
        City not found.
      </div>
    );
  }

  const today = weatherData.daily[0];
  const city = weatherData.city || "Unknown City";
  const country = weatherData.country || "";
  const date = new Date().toDateString().replace(" ", ", ");
  const temparature = today.temperature.day.toFixed(1);
  const description = today.condition.description;
  const wind = today.wind.speed;
  const humidity = today.temperature.humidity;
  const imgSrc = today.condition.icon_url;

  return (
    <>
      <div className="text-xl text-black font-['Poppins','_sans-serif'] grid gap-8">
        <div className="city-name">
          <h2 className="text-center py-6 font-bold text-4xl">
            {city}, {country}
          </h2>
        </div>
        <div className="date text-center">{date}</div>
        <div className="temperature flex justify-center items-center gap-4   text-[#1e2432] ">
          <img src={imgSrc} alt={`${description} weather icon`}></img>
          <div className="font-bold text-2xl md:text-5xl text-balance">{temparature}°C | °F</div>
        </div>
        <div className="weather-desc text-rose-700 text-center">
          {description}
        </div>
        <div className="weather-info text-center flex justify-center gap-4">
          <div>{wind} m/s Wind speed</div>
          <div>{humidity}% Humidity</div>
        </div>
      </div>
    </>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("hyderabad");
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocation(e.target.elements.location.value); // Update submitted location
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.shecodes.io/weather/v1/forecast?query=${location}&key=${apiKey}&units=metric`
        );
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, [location]); // Fetch when location changes

  return (
    <>
      <div className="w-full h-screen flex flex-wrap justify-center items-center text-white">
        <div className="p-8  rounded-xl bg-slate-300/50 max-w-3xl w-11/12">
          <form
            onSubmit={handleSubmit}
            className="flex  justify-between gap-2 h-12"
          >
            <input
              type="text"
              name="location"
              className="text-black px-4 bg-amber-50 border-none w-11/12 text-2xl font-['Poppins','_sans-serif']"
            />
            <button
              type="submit"
              className="cursor-pointer bg-black text-white px-4 py-1 rounded hover:bg-black/75"
            >
              Search
            </button>
          </form>
          <Card weatherData={data} error={error} />
        </div>
      </div>
    </>
  );
}

export default App;
