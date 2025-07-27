const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Chocolate", "Candy", "Ladoo", "Barfi"],
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantityInStock: {
    type: Number,
    required: true,
    min: 0
  }
 
});

const Sweets=mongoose.model("Sweet", sweetSchema);

module.exports = Sweets;