import React, { useEffect, useState } from "react";
import {
  Map,
  GoogleApiWrapper,
  Polygon,
  Marker,
  InfoWindow,
} from "google-maps-react";
import useGeoLocation from "./geolocation";
import "./ParkingData.css"; // Add a CSS file for styling

const ParkingData = (props) => {
  const [parkingData, setParkingData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ electric: false, disability: false });
  const location = useGeoLocation();

  const refreshLocation = () => setForceRefresh(!forceRefresh);

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch("http://localhost:4000/proxy");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setParkingData(data.features);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, []);

  useEffect(() => {
    if (parkingData.length > 0) {
      const polygons = parkingData.map(
        (oneParkingData) => oneParkingData.geometry.coordinates
      );
      setPolygonCoords(polygons);
    }
  }, [parkingData]);

  const filteredParkingData = parkingData.filter((record) => {
    const { name, tyyppi, sahkoauto, inva } = record.properties;
    return (
      (!filters.electric || sahkoauto) &&
      (!filters.disability || inva) &&
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyyppi.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const onMarkerClick = (props, marker) => {
    setSelectedPlace({
      name: props.name,
      tyyppi: props.tyyppi,
      status: props.status,
      spaces: props.spaces,
      sahkoauto: props.sahkoauto,
      inva: props.inva,
    });
    setActiveMarker(marker);
    setShowInfoWindow(true);
  };

  const onMapClick = () => {
    if (showInfoWindow) {
      setShowInfoWindow(false);
      setActiveMarker(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="parking-data-app">
      <header className="app-header">
        <h1>Parking Finder</h1>
        <p>Find parking spots around Helsinki.</p>
      </header>
      <div className="app-content">
        <aside className="sidebar">
          <h2>Filters</h2>
          <input
            type="text"
            placeholder="Search by name or type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={filters.electric}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, electric: !prev.electric }))
                }
              />
              Electric Vehicle Spaces
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.disability}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, disability: !prev.disability }))
                }
              />
              Disability Spaces
            </label>
          </div>
          <button onClick={refreshLocation} className="refresh-button">
            Refresh Location
          </button>
          <p>
            Current Location:
            {location.loaded
              ? `${location.coordinates.lat}, ${location.coordinates.lng}`
              : "Loading..."}
          </p>
        </aside>
        <main className="map-container">
          <Map
            google={props.google}
            zoom={12}
            initialCenter={
              location.loaded
                ? { lat: location.coordinates.lat, lng: location.coordinates.lng }
                : { lat: 60.1699, lng: 24.9384 }
            }
            style={{ width: "100%", height: "100%" }}
            onClick={onMapClick}
          >
            {polygonCoords.map((polygon, index) => (
              <Polygon
                key={index}
                paths={polygon[0].map(([lng, lat]) => ({ lat, lng }))}
                strokeColor="#f00202"
                strokeOpacity={1}
                strokeWeight={2}
                fillColor="#1be6f5"
                fillOpacity={1}
              />
            ))}
            {filteredParkingData.map((record, index) => {
              const [lng, lat] = record.geometry.coordinates[0][0];
              return (
                <Marker
                  key={index}
                  position={{ lat, lng }}
                  onClick={onMarkerClick}
                  name={record.properties.name}
                  tyyppi={record.properties.tyyppi}
                  status={record.properties.status}
                  spaces={record.properties.autopaikk}
                  sahkoauto={record.properties.sahkoauto}
                  inva={record.properties.inva}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                  }}
                />
              );
            })}
            <InfoWindow marker={activeMarker} visible={showInfoWindow}>
              <div>
                <h3>Parking Info</h3>
                <p>Name: {selectedPlace.name}</p>
                <p>Type: {selectedPlace.tyyppi}</p>
                <p>Status: {selectedPlace.status}</p>
                <p>Spaces: {selectedPlace.spaces}</p>
                <p>Electric Cars: {selectedPlace.sahkoauto}</p>
                <p>Disability Space: {selectedPlace.inva}</p>
              </div>
            </InfoWindow>
          </Map>
        </main>
      </div>
      <footer className="app-footer">
        <p>&copy; 2024 Southwest Developers</p>
      </footer>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBBss7i8tmTmtPnn3j8YKRFChwDeMzvsUk",
})(ParkingData);
