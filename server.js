import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import fs from 'fs/promises';
import path from 'path';


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
        console.error("Failed to read data:", error);
        res.status(500).json({ message: "Failed to load tabs data." });

    }
})


const datapath = path.resolve('./tabsData.json');

app.post('/api/add-tab', async (req, res) => {
    const newTab = req.body;
    // console.log(newTab);

    try {
        const file = await fs.readFile(datapath, 'utf-8');
        const currData = JSON.parse(file);

        if (!newTab.name || !newTab.description) {
            return res.status(400).json({ message: "Invalid input" });
          }

        currData[newTab.name] = {
            description: newTab.description,
            tabIcon: newTab.icon,
            image: newTab.image,
            amenities: newTab.amenities,
        };

        console.log(currData);
        

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