const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

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
    await client.connect();
    const jobsCollection = client.db('chakriDB').collection('jobs');
    const bidsCollection = client.db("chakriDB").collection('bids');

    app.get('/', (req, res) => {
      res.send('Sweet Home');
    });

    app.get('/jobs', async(req, res) => {
      const query = jobsCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get('/jobs/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollection.findOne(query);
      res.send(result || "{}");
    });

    app.get('/myjob/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email}
      const result = await jobsCollection.find(query).toArray();
      res.send(result || "[]");
    });



    // Post methods
    app.post('/jobs', async(req, res) => {
      const job = req.body;
      const result = await jobsCollection.insertOne(job);
      res.send(result);
    });

    app.post('/bids', async(req, res) => {
      const bid = req.body;
      const result = await bidsCollection.insertOne(bid);
      res.send(result);
    });

    
    app.listen(port, () => {
      console.log(`http://localhost:${port}`)
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
