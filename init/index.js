// init/index.js (or init.js)

const mongoose = require("mongoose");
const sampleListings = require("./data.js"); // make sure path is correct
const Listing = require("../models/listing.js");

// database connection
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(mongo_url);
  console.log("✅ Connected to MongoDB");
}

const initDb = async () => {
  try {
    await Listing.deleteMany({});
    console.log("🗑️ Old data deleted");

    await Listing.insertMany(sampleListings);
    console.log("🌱 Sample data inserted");

  } catch (err) {
    console.error("❌ Error seeding DB:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed");
  }
};

main().then(() => initDb());
