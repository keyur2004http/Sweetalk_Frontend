import React, { useEffect, useState } from 'react';

const LocationInput = ({ location, setLocation }) => {
  const [cities] = useState(["Surat", "Ahmedabad", "Mumbai", "Delhi"]);
  const [city, setCity] = useState('Select City');
  const [country, setCountry] = useState('');
  const [useCurrent, setUseCurrent] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const cityName = data.address.city || data.address.town || data.address.village;
        const countryName = data.address.country;
        if (cityName) {
          setCity(cityName);
          setLocation(cityName);
        }
        if (countryName) {
          setCountry(countryName);
        }
      } catch (err) {
        console.error('Error fetching city:', err);
      }
    });
  }, [setLocation]);

  return (
    <div className="mb-3">
      <label className="form-label">Location</label>
      <select
        className="form-select"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          setUseCurrent(false);
        }}
      >
        <option value="">{city}{country ? ", " + country : ""}</option>
        {cities.map((city, idx) => (
          <option key={idx} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationInput;
