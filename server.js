import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
});

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import fs from 'fs/promises';
import path from 'path';


const app = express();
const port = 6006;

app.use(cors({
    origin: 'https://babun-assignment-007.netlify.app'
}))
app.use(express.json());
app.use(bodyParser.json());

// import tabsData from './tabsData.json'assert { type: 'json' };


app.get('/api/tabsData', async(req, res) => {
    try {
        res
        const file = await fs.readFile(datapath, 'utf-8');
        const tabsData = JSON.parse(file);
        res.status(200).json(tabsData);
    } catch (error) {
        console.error("Failed to read data:", error);
        res.status(500).json({ message: "Failed to load tabs data." });

    }
})


const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("BabunRoy ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const base64 = authHeader.split(' ')[1];
    const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  
    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
      next();
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  };
  


const datapath = path.resolve('./tabsData.json');

app.post('/api/add-tab',  async (req, res) => {
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



app.delete('/api/delete-tabs', async (req, res) => {
    const tabsToDelete = req.body.tabs;
    console.log(tabsToDelete);
    

    if (!Array.isArray(tabsToDelete) || tabsToDelete.length === 0) {
        return res.status(400).json({ message: 'No tabs provided for deletion' });
    }

    try {
        const file = await fs.readFile(datapath, 'utf-8');
        const currData = JSON.parse(file);

        tabsToDelete.forEach(tab => {
            if (currData[tab]) {
                delete currData[tab];
            }
        });

        await fs.writeFile(datapath, JSON.stringify(currData, null, 2));

        res.status(200).json({
            message: 'Tabs deleted successfully',
            deleted: tabsToDelete
        });

    } catch (error) {
        console.error('Error deleting tabs:', error);
        res.status(500).json({ message: 'Server error while deleting tabs' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

})