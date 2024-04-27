var express = require("express");
var cors = require("cors");
var app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require('dotenv').config()
app.get("/", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
 
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hefn8jo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Craft");
    const craftCollection = database.collection("craftCollection");

    app.get("/craft", async (req, res) => {
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
    app.get("/craft/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await craftCollection.findOne(query);
        res.send(result);
      });
    app.get("/craft-email/:email", async (req, res) => {
        const email = req.params.email
        const query = { email: email }
 
        const cursor = craftCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });


 
      

    app.post("/add-craft", async (req, res) => {
      const newData = req.body;
      console.log(newData);
      console.log(newData);
      const result = await craftCollection.insertOne(newData);
      res.send(result);
    });


    app.delete('/delete-craft/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await craftCollection.deleteOne(query);
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 5000");
});

//   GQGE8mhUbwBdK2wz
