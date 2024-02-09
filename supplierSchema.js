const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const supplySchema = Schema({
  name: String,
  vendor: String,
  stock: Number,
  price: Number,
  category: String,
  rating: [Number, Number],
  description: String,
});

module.exports = mongoose.model("supplies", supplySchema);
