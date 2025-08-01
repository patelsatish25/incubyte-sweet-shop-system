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
    const {  name, category, price, quantityInStock } = req.body;

    if ( !name || !category || !price || !quantityInStock ) {
      return res.status(400).json({ error: "Missing required sweet fields" });
    }
    // Save the sweet
    const newSweet = new Sweets({
          // You need to add this field in schema too
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
  try {
    const sweets = await Sweets.find();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sweets." });
  }
}

const searchSweets =async(req,res)=>{
 
const { name, category, minPrice, maxPrice } = req.query;
const query = {};

// Case-insensitive name search
if (name) {
  console.log(name)
  query.name = { $regex: name, $options: "i" };
}

// Exclude 'All' category from query
if (category && category !== "All") {
  query.category = category;
}

if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = parseFloat(minPrice);
  if (maxPrice) query.price.$lte = parseFloat(maxPrice);
}

const sweets = await Sweets.find(query);

res.json(sweets);
};

const updateSweet=async(req,res)=>{
  try {
    const sweetId = req.params.id;
    const updateData = req.body;
   
   console.log("calll")

    const updated = await Sweets.findByIdAndUpdate(sweetId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error during update" });
  }
}

const deleteSweet=async(req,res)=>{
  try {
    // ✅ Check if user is admin
    const role = req.headers["role"];
    if (role !== "admin") 
      {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const deleted = await Sweets.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports ={addSweets,getSweets,searchSweets,updateSweet,deleteSweet};