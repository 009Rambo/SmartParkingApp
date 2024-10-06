// src/App.js
import React from 'react';
import ParkingData from './ParkingData';
import './App.css'; // If you created styles.css for styling

function App() {
    return (
        <div className="App">
            <h1>Smart Parking App</h1>
            <ParkingData />
        </div>
    );
}

export default App;
