function fetchParkingData() {
    const apiUrl = 'http://localhost:3000/proxy'; // Pointing to the local proxy server
    const parkingDataContainer = document.getElementById('parkingDataContainer');

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

    // Access the records from the data
    const records = data.result.records;

    // Loop through each record and extract the required information
    records.forEach(record => {
        const name = record.KOHDETYYPPI || 'N/A'; // Type of parking area
        const total = record.PAIKKOJEN_LUKUMÄÄRÄ || 'N/A'; // Number of parking spaces
        const price = record.HINTA || 'N/A'; // Price per hour

        const parkingInfo = document.createElement('div');
        parkingInfo.textContent = `Type: ${name}, Total Spaces: ${total}, Price: ${price}€`;
        parkingDataContainer.appendChild(parkingInfo);
    });
}

// Call the function to fetch and display the data
fetchParkingData();
