const mongoconnect=require("../mongodbcon");
const Sweets = require("../model/SweetModels");
if (process.env.NODE_ENV !== "test") {
    mongoconnect();
  }
const purchaseSweet=async(req,res)=>{
  
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
      }
  
      const sweet = await Sweets.findById(id);
  
      if (!sweet) {
        return res.status(404).json({ error: "Sweet not found" });
      }
  
      if (sweet.quantityInStock < quantity) {
        return res.status(400).json({ error: "Not enough stock available" });
      }
  
      sweet.quantityInStock -= quantity;
      await sweet.save();
  
      res.status(200).json({
        message: `Successfully purchased ${quantity} ${sweet.name}`,
        remainingStock: sweet.quantityInStock,
      });
    } catch (err) {
      console.error("Purchase error:", err);
      res.status(500).json({ error: "Server error" });
    }
  
  }

  const restockSweet=async(req,res)=>{
   
  }
  module.exports={purchaseSweet,restockSweet}
