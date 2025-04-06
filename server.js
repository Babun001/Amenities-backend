import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 6006;

app.use(cors({
    origin: '*'
}))
app.use(express.json());
app.use(bodyParser.json());

import tabsData from './tabsData.json'assert { type: 'json' };


app.get('/api/tabsData', (req, res) => {
    try {
        res
            .status(200)
            .json(tabsData);
    } catch (error) {
        console.error("Failed to read data:", err);
        res.status(500).json({ message: "Failed to load tabs data." });

    }
})

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const datapath = path.resolve('./tabsData.json');

app.post('/api/add-tab', async (req, res) => {
    const newTab = req.body;
    // console.log(response);

    try {
        const file = await fs.readFile(datapath, 'utf-8');
        const currData = (file);

        currData[newTab.name] = {
            description: newTab.description,
            icon: newTab.icon,
            image: newTab.image,
            amenitie: newTab.amenitie,
        };

        await fs.writeFile(datapath, JSON.stringify(currData, null, 2));
        res
            .status(200)
            .json({
                message: "Tab added successfully!"
            })

    } catch (error) {
        console.error("Error writing data:", error);
        res.status(500).json({ message: "Failed to add tab." });
    }
})




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

})