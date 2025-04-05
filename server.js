import express from 'express';
import cors from 'cors';
const app = express();
const port = 6006;

app.use(cors({
    origin:'*'
}))
app.use(express.json())

import tabsData from './Data.mjs';

app.get('/api/tabsData',(req,res) =>{
    res
    .status(200)
    .json(tabsData);
})

app.listen(port,() =>{
    console.log(`Server is running on http://localhost:${port}`);
    
})