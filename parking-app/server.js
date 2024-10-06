import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Importing node-fetch

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/proxy', async (req, res) => {
    const apiUrl = 'https://data.tampere.fi/data/api/3/action/datastore_search?resource_id=6a7cb189-54db-4895-8570-22a1c2c2446e&limit=5';

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
