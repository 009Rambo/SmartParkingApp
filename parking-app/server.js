import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Importing node-fetch

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/proxy', async (req, res) => {
    const apiUrl = 'https://services1.arcgis.com/sswNXkUiRoWtrx0t/arcgis/rest/services/LIIPI_Autoliitynt%C3%A4pys%C3%A4k%C3%B6inti/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

//start the server
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
