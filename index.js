const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();


// abirmahmud221
// qb1AYVwZjlPWW4YZ

// middleware
app.use(express.json())
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig));

const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://abirmahmud221:qb1AYVwZjlPWW4YZ@cluster0.nesc3d0.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("userDB").collection("users");
    const cartCollection = client.db("cart").collection("cartItems");
    

    // post single data endpoint	
    app.post("/users", async (req, res) => {
        const user = req.body;
  
        console.log("user", user)
  
        const result = await userCollection.insertOne(user);
        console.log(result);
        res.send(result);
      })
    // post single data endpoint for cart	
    app.post("/cartItems", async (req, res) => {
        const cart = req.body;
  
        console.log("cart", cart)
  
        const result = await cartCollection.insertOne(cart);
        console.log(result);
        res.send(result);
      })
    
//get for user
    app.get("/users", async(req, res) => {
        const result = await userCollection.find().toArray();
        console.log(result);
        res.send(result);
      })

      // Get Single data using id (UPDATE endpoint)
    app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        console.log("id", id);
        const query = {
          _id: new ObjectId(id),
        };
        const result = await userCollection.findOne(query);
        res.send(result);  
      });

      // update single user
    app.put("/users/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = {
          _id: new ObjectId(id),
        };
        const options = { upsert: true };
        const updatedData = {
          $set: {
            name : data.name,
      brandName: data.brandName,
      image: data.image,
      price: data.price,
      description: data.description,
          },
        };
        const result = await userCollection.updateOne(
          filter,
          updatedData,
          options
        );
        res.send(result)
      });
  

      // get cart items 
      app.get("/cart", async (req, res) => {
        
        const cursor = cartCollection.find();
        
        const result = await cursor.toArray();
        res.send(result);  
      });

      // delete single data from cart endpoint 
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id : id,
      };
      const result = await cartCollection.deleteOne(query);
      res.send(result);

    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
