// src/ParkingData.js
import React, { useEffect, useState } from 'react';

const ParkingData = () => {
    const [parkingData, setParkingData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

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
        </div>
    );
};

export default ParkingData;
