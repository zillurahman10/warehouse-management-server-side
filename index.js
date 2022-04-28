const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('All cars are sold! :(')
})

app.listen(port, (req, res) => {
    console.log('Port is running', port);
})