const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
const app = express()

// middleware
app.use(cors())
app.use(express.json())

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden accesss' })
        }
        console.log('decoded', decoded);
        req.decoded = decoded
        next()
    })
}

app.get('/', (req, res) => {
    res.send('Welcome to Car.com api!')
})



const uri = `mongodb+srv://products:hJ3gtXuVbcuA0Ulr@cluster0.gaai3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()

        const productCollection = client.db("cardotcom").collection("products")

        app.post('/login', async (req, res) => {
            const user = req.body
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            })
            res.send({ accessToken })
        })

        // loading products
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // showing inventory item
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        })

        // showing my Items
        app.get('/myitems', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.query.email
            if (email === decodedEmail) {
                const query = { email: email }
                const cursor = productCollection.find(query)
                const items = await cursor.toArray()
                res.send(items)
            }
            else {
                res.status(403).send({ message: 'forbidden access' })
            }
        })

        // updating the quantity of product
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const delivered = req.body
            console.log(delivered);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: delivered.quantity
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // deleting the product from manage inventory
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        // sending products from add products
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productCollection.insertOne(product)
            res.send(result)
        })

        app.put('/inventory/:id', async (req, res) => {
            const id = req.body.id
            const update = req.body
            console.log(update);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: update.quantity
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        const brandCollection = client.db("cardotcom").collection("brands")

        app.get('/brands', async (req, res) => {
            const query = {}
            const cursor = brandCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        const reviewCollection = client.db("cardotcom").collection("reviews")

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(console.dir)


app.listen(port, (req, res) => {
    console.log('Port is running', port);
})