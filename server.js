const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const supplierSchema = require("./supplierSchema");
const { MongoClient } = require("mongodb");

const port = 3000;

const connectionUri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionUri);


mongoose
  .connect(
    "mongodb://127.0.0.1:27017",
    // 'mongodb+srv://maxwel:qqhKCK5rrY1o57zI@cluster0.3iojfri.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
app.set("view engine", "pug");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//============================= Loading Supplies Data=============================

async function fetchSupplies() {
  try {
    await client.connect();
    const database = client.db("a4");
    const suppliesCollection = database.collection("supplies");

    const allSuppliesCursor = await suppliesCollection.find({});
    const allSupplies = [];

    await allSuppliesCursor.forEach((supply) => {
      allSupplies.push(supply);
    });

    return allSupplies;
  } catch (error) {
    console.error("Error fetching supplies:", error);
    return null;
  } finally {
    await client.close();
  }
}

//------------------------ Get the main page--------------
app.get("/", (req, res) => {
  res.render("pages/home");
});

// Use routes/supplies
app.get("/items", async (req, res) => {
  const supplies = await fetchSupplies();
  const acceptHeader = req.get("Accept");
  if (acceptHeader && acceptHeader.includes("application/json")) {
    res.json(supplies);
  } else {
    res.render("pages/supplies", { supplies });
  }
});

app.get("/items/:id", async (req, res) => {
  const supplyData = await supplierSchema.find();
  const supplyID = req.params.id;
  let supplyInfo = NaN;
  for (const [vid, supplyDetails] of Object.entries(supplyData)) {
    if (supplyID == supplyDetails._id) {
      supplyInfo = supplyDetails;

      console.log(supplyDetails._id);
    }
  }

  if (!supplyInfo) {
    return res.status(404).send("<H1>Vendor not found</H1>");
  }

  const acceptHeader = req.get("Accept");

  if (acceptHeader && acceptHeader.includes("application/json")) {
    res.json(supplyInfo);
  } else {
    res.render("pages/supplyDetails", { supplyInfo });
  }
});

// --------------==========Update single supplyItem----------

app.put("/items/:id", async (req, res) => {
  const supplyId = req.params.id;

  try {
    const id = supplyId;
    const updatedData = req.body;
    const options = { new: true };

    const result = await supplierSchema.findByIdAndUpdate(
      id,
      updatedData,
      options
    );

    if (!supply) {
      return res.status(404).send("<h1>Supply item not found</h1>");
    }

    res.status(200).send("Supply item updated successfully");
  } catch (error) {
    console.error("Error updating supply item:", error);
    res.status(500).send("Failed to update supply item");
  }
});

app.get("/additem", (req, res) => {
  res.render("pages/addNewSupply");
});

// ===============New supplies===============
app.post("/items", async (req, res) => {
  try {
    console.log(req.body);
    const newItem = new supplierSchema({
      name: req.body.name,
      vendor: req.body.vendor,
      stock: req.body.stock,
      price: req.body.price,
      category: req.body.cateory,
      rating: [-1, -1],
      description: req.body.description,
    });

    newItem.save();
    res.status(201).send(`The record for ${req.body.name} was created`);
  } catch (error) {
    console.error("Error creating supply item:", error);
    res.status(500).send("Failed to create supply item");
  }
});

// ================Delete a single supply item----------

// GET endpoint for rendering the delete items page
app.get("/delete", async (req, res) => {
  try {
    const items = await supplierSchema.find();

    res.render("pages/delete", { items });
  } catch (error) {
    console.error("Error fetching items for deletion:", error);
    res.status(500).send("Failed to fetch items for deletion");
  }
});

app.delete("/items/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const deletedItem = await supplierSchema.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(500).send("Failed to delete supply item");
    }

    return res.status(201).send("Supply item deleted successfully");
  } catch (error) {
    console.error("Error deleting supply item:", error);
    return res.status(500).send("Failed to delete supply item");
  }
});

// ---------------GET endpoint for rendering the bulk update page-------------
app.get("/bulk", async (req, res) => {
  try {
    const supplies = await supplierSchema.find();
    res.render("pages/bulk", { supplies });
  } catch (error) {
    console.error("Error fetching supplies:", error);
    res.status(500).send("Failed to fetch supplies");
  }
});

// ========== PUT endpoint for incrementing stock values of selected supplies===============
app.post("/addstock", async (req, res) => {
  const { selectedSupplies, incrementValue } = await req.body;
  console.log(selectedSupplies);

  try {
    // Convert selected supplies array to object IDs
    const updatePromises = Object.keys(selectedSupplies).map(async (id) => {
      try {
        await supplierSchema.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id) },
          { $inc: { stocks: Number(incrementValue[0]) } },
          { new: true }
        );
      } catch (error) {
        console.error(`Error updating supply with _id ${id}:`, error);
       
      }
    })
   

    if (updatedSupplies.nModified > 0) {
      return res.status(200).send("Stock updated successfully");
    } else {
      return res.status(404).send("No supplies updated or supplies not found");
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    return res.status(500).send("Failed to update stock");
  }
});


app.listen(port, () => {
  console.log(`server started at port 127:0.0.1:${port} ...`);
});
