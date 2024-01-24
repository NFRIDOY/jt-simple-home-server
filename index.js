//npm i express cors dotenv
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// req 
app.use(express.json());
// app.use(cors())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlezmce.mongodb.net/?retryWrites=true&w=majority`;
// const uri = process.env.URI;

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
        client.connect();
        // Send a ping to confirm a successful connection
        client.db("admin").command({ ping: 1 });

        // Database & Collections

        const database = client.db("simpleHomeDB");
        const userCollection = database.collection("users");

        // APIs

        

        // update or insert a user
        app.put('/users', async (req, res) => {
            try {
                const userReq = req?.body;
                console.log(req.body?.email);

                const filter = { email: req.body?.email };

                /* Set the upsert option to insert a document if no documents match
                the filter */
                const options = { upsert: true };

                const updateUser = {
                    $set: {
                        email: req.body?.email,
                        name: req.body?.name,
                        user: req.body?.user
                    },
                };

                const result = await userCollection.updateOne(filter, updateUser, options);
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        })


        // User get API. get all users
        app.get('/users', async (req, res) => {
            try {
                const result = await userCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('JT simple Home Server is Online')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})