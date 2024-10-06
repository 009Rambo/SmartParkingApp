function fetchParkingData() {
    const apiUrl = 'http://localhost:3000/proxy'; // Pointing to your local proxy server

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the entire data response
            displayParkingData(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            parkingDataContainer.textContent = 'Failed to load parking data.';
        });
}

function displayParkingData(data) {
    const parkingDataContainer = document.getElementById('parkingDataContainer');
    parkingDataContainer.innerHTML = ''; // Clear previous data

    const records = data.result.records;

    // Loop through each record
    records.forEach(record => {
        const name = record.KOHDETYYPPI || 'N/A'; // Type of parking area
        const total = record.PAIKKOJEN_LUKUMÄÄRÄ || 'N/A'; // Total parking spaces
        const price = record.HINTA || 'N/A'; // Price per hour

        const parkingInfo = document.createElement('div');
        parkingInfo.textContent = `Type: ${name}, Total Spaces: ${total}, Price: ${price}€`;
        parkingDataContainer.appendChild(parkingInfo);

        // Add marker to the map
        const coords = extractCoordinates(record.GEOLOC); // Create this function to parse the GEOLOC string
        if (coords) {
            const marker = L.marker(coords).addTo(map)
                .bindPopup(`${name}<br>Total Spaces: ${total}<br>Price: ${price}€`)
                .openPopup();
        }
    });
}

function extractCoordinates(geoloc) {
    const coordsMatch = geoloc.match(/POLYGON \(\(\s*([0-9.]+)\s+([0-9.]+)/);
    if (coordsMatch) {
        return [parseFloat(coordsMatch[2]), parseFloat(coordsMatch[1])]; // [lat, lon]
    }
    return null; // If no valid coordinates found
}

// Initialize the map
const map = L.map('map').setView([61.4991, 23.7871], 13); // Set to Tampere coordinates

// Add a tile layer to the map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Call the function to fetch and display the data
fetchParkingData();
