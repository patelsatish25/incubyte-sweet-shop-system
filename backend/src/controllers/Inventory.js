const mongoconnect=require("../mongodbcon");
const Sweets = require("../model/SweetModels");
if (process.env.NODE_ENV !== "test") {
    mongoconnect();
  }
const purchaseSweet=async(req,res)=>{
  
   
  
  }

  module.exports={purchaseSweet}
