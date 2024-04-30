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


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("Craft");
    const craftCollection = database.collection("craftCollection");
    const categoryCollection = database.collection("categoryCollection");


// this is our all data api


    app.get("/craft", async (req, res) => {
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });


      // dynamic data load api


    app.get("/craft/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await craftCollection.findOne(query);
        res.send(result);
      });


      // ...............................................................................................

      
    app.get("/craft-email/:email", async (req, res) => {
        const email = req.params.email
        const query = { email: email }
 
        const cursor = craftCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      // ...............................................................................................


    app.get("/craft/:email", async (req, res) => {
        const email = req.params.email
        const query = { email: email }
 
        const cursor = craftCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });


      // ...............................................................................................
 
      

    app.post("/add-craft", async (req, res) => {
      const newData = req.body;
      console.log(newData); 
      const result = await craftCollection.insertOne(newData);
      res.send(result);
    });

      // ...............................................................................................



    app.get("/categoryCollection", async (req, res) => {
        const cursor = categoryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });


      // ...............................................................................................


    app.delete('/delete-craft/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await craftCollection.deleteOne(query);
        res.send(result);
    })

      // ...............................................................................................


    app.put("/craft-update/:id", async (req, res) => {
        const id = req.params.id;
        const newData = req.body;
        console.log(id, newData);
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            email:newData.email, 
            name:newData.name,
            image:newData.image,
            rating:newData.rating,
            price:newData.price,
            Customization:newData.Customization,
            processing_time:newData.processing_time,
            stockStatus:newData.stockStatus,
            short_description:newData.short_description,
            sub_category:newData.sub_category,
          },
        };
        
        const result = await craftCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      });
  

     
  } finally { 
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("your server is running");
});

 