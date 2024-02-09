const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const connectionUri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionUri);

async function initializeDatabase() {
  try {
    await client.connect();
    const adminDb = client.db("admin");
    const listDatabases = await adminDb.admin().listDatabases();

    const databaseExists = listDatabases.databases.some(
      (db) => db.name === "a4"
    );
    if (databaseExists) {
      const database = client.db("a4");
      await database.dropDatabase();
    }

    const database = client.db("a4");
    // Create a supplies collection with the given schema
    const supplySchema = {
      name: String,
      vendor: String,
      stock: Number,
      price: Number,
      category: String,
      rating: [Number, Number],
      description: String,
    };
    const suppliesCollection = database.collection("supplies");

    // Read JSON files and insert data into the collection
    const files = fs.readdirSync("./vendors");
    for (const file of files) {
      const filePath = path.join("./vendors", file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      for (const category in data.supplies) {
        const supplies = data.supplies[category];
        for (const itemId in supplies) {
          const supply = supplies[itemId];
          const supplyData = {
            name: supply.name,
            vendor: data.name,
            stock: supply.stock,
            price: supply.price,
            category,
            rating: [-1, -1],
            description: supply.description,
          };
          await suppliesCollection.insertOne(supplyData);
        }
      }
    }

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.close();
  }
}

initializeDatabase();
