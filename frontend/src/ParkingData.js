// src/ParkingData.js
import React, { useEffect, useState } from "react";
import {
  Map,
  GoogleApiWrapper,
  Polygon,
  Marker,
  InfoWindow,
} from "google-maps-react";
import useGeoLocation from "./geolocation";

// Define the projection for UTM Zone 35 (Tampere)
const proj4Def = "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs";

const ParkingData = (props) => {
  const [parkingData, setParkingData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null); // State for the active marker
  const [selectedPlace, setSelectedPlace] = useState({}); // State for selected marker info
  const [showInfoWindow, setShowInfoWindow] = useState(false); // State to control InfoWindow visibility
  const [forceRefresh, setForceRefresh] = useState(false);
  const location = useGeoLocation();

  const refreshLocation = () => {
    setForceRefresh(!forceRefresh); // Toggle to force re-render
  };

  const style = {
    width: "100%",
    height: "80%",
  };

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch("http://localhost:4000/proxy");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setParkingData(data.features); // Assuming data.features is an array of parking data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, []);

  useEffect(() => {
    // Set polygon coordinates
    if (parkingData.length > 0) {
      const polygons = parkingData.map(
        (oneParkingData) => oneParkingData.geometry.coordinates
      );
      setPolygonCoords(polygons);
    }
  }, [parkingData]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Parking Data</h2>
      <button onClick={refreshLocation}>Refresh Location</button>
      <p>
        Current Location:
        {location.loaded
          ? `${location.coordinates.lat}, ${location.coordinates.lng}`
          : "Loading..."}
      </p>
      <Map
        google={props.google}
        zoom={12}
        //initialCenter={{ lat: 60.1699, lng: 24.9384 }}
        initialCenter={
          location.loaded
            ? { lat: location.coordinates.lat, lng: location.coordinates.lng }
            : { lat: 60.45148, lng: 22.26869 }
        }
        style={style}
        onClick={onMapClick} // Hide InfoWindow when map is clicked
      >
        {polygonCoords.map((polygon, index) => {
          const convertedCoordinates = polygon[0].map(([lng, lat]) => ({
            lat,
            lng,
          }));
          return (
            <Polygon
              key={index}
              paths={convertedCoordinates}
              strokeColor="#f00202"
              strokeOpacity={1}
              strokeWeight={2}
              fillColor="#1be6f5"
              fillOpacity={1}
            />
          );
        })}

        {parkingData.map((record, index) => {
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
                url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // URL for a blue Google Maps marker
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
            <p>Disabilty Space: {selectedPlace.inva}</p>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBBss7i8tmTmtPnn3j8YKRFChwDeMzvsUk",
})(ParkingData);
