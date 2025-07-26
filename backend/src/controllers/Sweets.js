const mongoconnect=require("../mongodbcon");
const Sweets = require("../model/SweetModels");
if (process.env.NODE_ENV !== "test") {
    mongoconnect();
  }
const addSweets=async(req,res)=>
{
    const role = req.headers["role"];

    console.log("📌 Role from header:", role);
  try{
    // Allow only if user is admin
    if (role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const { sweetId, name, category, price, quantityInStock } = req.body;

    if (!sweetId || !name || !category || !price || !quantityInStock ) {
      return res.status(400).json({ error: "Missing required sweet fields" });
    }
    // Save the sweet
    const newSweet = new Sweets({
        sweetId,  // You need to add this field in schema too
        name,
        category,
        price,
        quantityInStock
      });
  
      await newSweet.save();
      
      return res.status(201).json({ message: "Sweet added successfully", sweet: newSweet });
  
    } catch (error) {
      console.error("❌ Error while adding sweet:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
   
     

}

const getSweets=async(req,res)=>{
 
}
module.exports ={addSweets,getSweets};