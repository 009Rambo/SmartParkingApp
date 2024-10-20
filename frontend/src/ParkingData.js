// src/ParkingData.js
import React, { useEffect, useState } from 'react';
import proj4 from 'proj4'; // Ensure proj4 is imported
import { Map, GoogleApiWrapper, Polygon } from 'google-maps-react';

// Define the projection for UTM Zone 35 (Tampere)
const proj4Def = '+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs';

const ParkingData = (props) => {
    const [parkingData, setParkingData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [polygonCoords, setPolygonCoords] = useState([]);

    const style = {
        width: '100%',
        height: '50%',
    };

    useEffect(() => {
        const fetchParkingData = async () => {
            try {
                const response = await fetch('http://localhost:4000/proxy'); // Adjusted to your backend endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setParkingData(data.features); // Adjust based on the actual data structure
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchParkingData();
    }, []);

    useEffect(() => {
        // Extract coordinates from the first record
        if (parkingData.length > 0) {
            let polygons = [];
            parkingData.forEach((oneParkingData) => {
                const coordinates = oneParkingData.geometry.coordinates;
                coordinates.forEach(oneCoordinate => {
                    polygons.push(oneCoordinate);
                })
            });
            setPolygonCoords(polygons);
        }
    }, [parkingData]);

    if (loading) {
        return <div>Loading...</div>; // Show loading message
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }
    
    return (
        <div>
            <h2>Parking Data</h2>
            {/* <ul>
                {parkingData.map((record, index) => (
                    <li key={index}>
                        Type: {record.KOHDETYYPPI}, Total Spaces: {record.PAIKKOJEN_LUKUMÄÄRÄ}, Price: {record.HINTA}€
                    </li>
                ))}
            </ul> */}
            <Map
                google={props.google} // Access the google prop correctly
                zoom={12}
                initialCenter={{ lat: 61.4978, lng: 23.761 }} // Initial center of the map (Tampere)
                style={style}
            >
                {polygonCoords.map((polygon, index) => {
                    const convertedCoordinates = polygon.map(oneCoordinate => {
                        return { lat: oneCoordinate[1], lng: oneCoordinate[0] }; // Return latitude and longitude
                    });
                    return (
                        <Polygon
                            key={index}
                            paths={convertedCoordinates}
                            strokeColor="#0000FF"
                            strokeOpacity={0.8}
                            strokeWeight={2}
                            fillColor="#fc0341"
                            fillOpacity={0.35}
                        />
                    );
                })}
            </Map>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY,
})(ParkingData);
