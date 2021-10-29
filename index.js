const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware-------------
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.af4at.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// ------------------------------------------------------

async function run() {
    try {
        await client.connect();
        const database = client.db("ExpressHomeDelivery");
        const servicesCollection = database.collection("services");
        const orderCollection = database.collection("addToOrder");
        const orderApprovedCollection = database.collection("orderApproved");

        // GET all services----------------------
        app.get('/allServices', async (req, res) => {
            const services = await servicesCollection.find({}).toArray();

            res.send(services);
        })
        // GET all order services----------------------
        app.get('/allOrderServices', async (req, res) => {
            const services = await orderCollection.find({}).toArray();

            res.send(services);
        })
        // GET all order Approved services----------------------
        app.get('/allOrderApprovedServices', async (req, res) => {
            const services = await orderApprovedCollection.find({}).toArray();

            res.send(services);
        })


        //get Single Service--------------------
        app.get('/singleServices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            // console.log(query)
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })


        //POST API new --------------------
        app.post('/postServices', async (req, res) => {

            const service = req.body;

            // console.log('hit the post api', service)

            const result = await servicesCollection.insertOne(service)
            // console.log(result)
            res.send(result)
        })

        //Orders api-----------------
        app.post('/addToOrders', async (req, res) => {

            const service = req.body;
            // console.log(service)
            // console.log('hit the post api', service)

            const result = await orderCollection.insertOne(service)
            // console.log(result)
            res.send(result)
        })
        //Order Approved api-----------------
        app.post('/orderApproved', async (req, res) => {

            const service = req.body;
            // console.log(service)
            // console.log('hit the post api', service)

            const result = await orderApprovedCollection.insertOne(service)
            // console.log(result)
            res.send(result)
        })

        // update api-------------------
        app.put('/updateServices/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateService.name,
                    email: updateService.email

                }
            }
            const result = await servicesCollection.updateOne(filter, option, updateDoc)
            res.json(result)
        })

        //get search -------------------
        app.get("/searchServices", async (req, res) => {
            const result = await servicesCollection.find({
                title: { $regex: req.query.search },

            }).toArray();
            res.send(result);
            // console.log(result);
        })

        // email get api----------------
        app.get('/myOrderServices/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(id)
            const query = { email: email }
            const myOrder = await orderCollection.find(query).toArray();
            res.send(myOrder)
        })

        // Delete service ----------
        app.delete('/deleteItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })
        // Delivery Finish  service ----------
        app.delete('/deliveryFinish/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            console.log(query)
            const result = await orderApprovedCollection.deleteOne(query);
            console.log(query)
            res.send(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);
// ------------------------------------------------------






app.get('/', (req, res) => {
    res.send('Running Express Home Delivery server');
})
app.get('/hello', (req, res) => {
    res.send("hello updated api testing")
})
app.listen(port, () => {
    console.log('Running Express Home Delivery server on port', port)
})