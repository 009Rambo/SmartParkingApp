// src/App.js
import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

import ParkingData from './ParkingData';

import './App.css'; // If you created styles.css for styling

function App(props) {
    const style = {
        width: '100%',
        height: '50%'
      };

    return (
        <div className="App">
            <h1>Smart Parking App</h1>
            <ParkingData />
            <Map
                google={props.google} // Access the google prop correctly
                zoom={14}
                initialCenter={{ lat: 61.4978, lng: 23.7610 }} // Initial center of the map (Tampere)
                style={style}
            />
        </div>
    );
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY // Replace with your actual API key
})(App);
