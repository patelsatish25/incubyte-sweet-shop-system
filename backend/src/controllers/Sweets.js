

const Sweets = require("../model/SweetModels");
const addSweets=(req,res)=>
{
    console.log("reqast come")
    const { sweetId, name, category, price, quantityInStock, imageUrl } = req.body;

    if (!sweetId || !name || !category || !price || !quantityInStock || !imageUrl) {
      return res.status(400).json({ error: "Missing required sweet fields" });
    }
}
module.exports =addSweets;