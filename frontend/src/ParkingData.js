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
                setParkingData(data.result.records); // Adjust based on the actual data structure
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchParkingData();
    }, []);

    useEffect(() => {
        const extractCoordinates = (geoLoc) => {
            // Remove "POLYGON ((" and "))" from the string
            const cleanedCoords = geoLoc.replace('POLYGON ((', '').replace('))', '').trim();
            // Split by comma and convert to array of coordinates
            const coordinatePairs = cleanedCoords.split(', ').map((coord) => {
                const [x, y] = coord.split(' ').map(Number);
                const wgs84Coord = proj4(proj4Def, [x, y]);
                return { lat: wgs84Coord[1], lng: wgs84Coord[0] };
            });
            return coordinatePairs;
        };

        // Extract coordinates from the first record
        if (parkingData.length > 0) {
            console.log('parking data is ', parkingData);
            let coords = [];
            parkingData.forEach((oneParkingData) => {
                const oneCoord = extractCoordinates(oneParkingData.GEOLOC);
                coords.push(oneCoord);
            });
            setPolygonCoords(coords);
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
            <ul>
                {parkingData.map((record, index) => (
                    <li key={index}>
                        Type: {record.KOHDETYYPPI}, Total Spaces: {record.PAIKKOJEN_LUKUMÄÄRÄ}, Price: {record.HINTA}€
                    </li>
                ))}
            </ul>
            <Map
                google={props.google} // Access the google prop correctly
                zoom={14}
                initialCenter={{ lat: 61.4978, lng: 23.761 }} // Initial center of the map (Tampere)
                style={style}
            >
                {polygonCoords.map((polygon, index) => {
                    console.log("Polygon is ", polygon);
                    return (
                        <Polygon
                            key={index}
                            paths={polygon}
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
