const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()

// middleware
app.use(cors())
app.use(express.json())

// products
// hJ3gtXuVbcuA0Ulr

app.get('/', (req, res) => {
    res.send('All cars are sold! :(')
})



const uri = `mongodb+srv://products:hJ3gtXuVbcuA0Ulr@cluster0.gaai3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()

        const productCollection = client.db("cardotcom").collection("products")



    }
    finally {

    }
}


app.listen(port, (req, res) => {
    console.log('Port is running', port);
})