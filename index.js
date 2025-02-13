const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scfrsgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db('docServiceDB').collection('services')
    const bookingCollection = client.db('docServiceDB').collection('bookings')


    app.get('/services', async(req,res)=>{
        const cursor = serviceCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/bookings', async(req,res)=>{
        const cursor = bookingCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        res.send(result)
    })

    app.post('/services', async (req, res)=>{
        const newService = req.body
        console.log(newService)
        const result = await serviceCollection.insertOne(newService);
        res.send(result)
    })

    app.post('/bookings', async (req, res)=>{
        const newBooking = req.body
        console.log(newBooking)
        const result = await bookingCollection.insertOne(newBooking);
        res.send(result)
    })

    app.put('/services/:id', async(req,res)=>{
        const id = req.params.id
        const updatedService = req.body
        console.log(id, updatedService)
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const service = {
            $set: {
                serviceName: updatedService.serviceName,
                price: updatedService.price, 
                serviceArea: updatedService.serviceArea,
                description: updatedService.description, 
                imgURL: updatedService.imgURL,
            }
        }

        const result = await serviceCollection.updateOne(filter, service, options)
        res.send(result)

    })

    app.put('/bookings/:id', async(req,res)=>{
        const id = req.params.id
        const updatedStatus = req.body
        console.log(id, updatedStatus)
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const booking = {
            $set: {
                status: updatedStatus.status
            }
        }

        const result = await bookingCollection.updateOne(filter, booking, options)
        res.send(result)

    })

    app.delete('/services/:id', async(req,res)=>{
        const id = req.params.id
        console.log('Delete from db', id)
        const query = {_id: new ObjectId(id)}
        const result = await serviceCollection.deleteOne(query)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Heal Hive is running')
})

app.listen(port, () =>{
    console.log(`Heal Hive server is running on port: ${port}`);
})
