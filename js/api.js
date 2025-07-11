const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URI = "mongodb+srv://tylertwining:Supersourdiesel1%21@cluster0.mkvrjfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "aeg"; // Database name

const app = express();
app.use(cors());
app.use(express.json());

let db, customers, vehicles, serviceRequests, preInspections;

MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    customers = db.collection("customers");
    vehicles = db.collection("vehicles");
    serviceRequests = db.collection("serviceRequests");
    preInspections = db.collection("preInspections");
    console.log("MongoDB connected!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- CUSTOMERS ---
app.get("/customers", async (req, res) => {
  res.json(await customers.find({}).toArray());
});
app.get("/customers/:id", async (req, res) => {
  res.json(await customers.findOne({ _id: new ObjectId(req.params.id) }));
});
app.post("/customers", async (req, res) => {
  const result = await customers.insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});
app.put("/customers/:id", async (req, res) => {
  await customers.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.json({ updated: true });
});
app.delete("/customers/:id", async (req, res) => {
  await customers.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ deleted: true });
});

// --- VEHICLES ---
app.get("/vehicles", async (req, res) => {
  res.json(await vehicles.find({}).toArray());
});
app.get("/vehicles/:id", async (req, res) => {
  res.json(await vehicles.findOne({ _id: new ObjectId(req.params.id) }));
});
app.post("/vehicles", async (req, res) => {
  const result = await vehicles.insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});
app.put("/vehicles/:id", async (req, res) => {
  await vehicles.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.json({ updated: true });
});
app.delete("/vehicles/:id", async (req, res) => {
  await vehicles.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ deleted: true });
});

// --- SERVICE REQUESTS ---
app.get("/serviceRequests", async (req, res) => {
  res.json(await serviceRequests.find({}).toArray());
});
app.post("/serviceRequests", async (req, res) => {
  const result = await serviceRequests.insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});

// --- PRE-INSPECTIONS ---
app.get("/preInspections", async (req, res) => {
  res.json(await preInspections.find({}).toArray());
});
app.post("/preInspections", async (req, res) => {
  const result = await preInspections.insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});

// --- HEALTH CHECK ---
app.get("/", (req, res) => res.send("AEG API online."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

