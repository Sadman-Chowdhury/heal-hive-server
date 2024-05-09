const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) =>{
    res.send('Heal Hive is running')
})

app.listen(port, () =>{
    console.log(`Heal Hive server is running on port: ${port}`);
})
