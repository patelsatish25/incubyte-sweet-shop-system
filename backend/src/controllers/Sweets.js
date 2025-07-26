const mongoconnect=require("../mongodbcon");
const Sweets = require("../model/SweetModels");
if (process.env.NODE_ENV !== "test") {
    mongoconnect();
  }
const addSweets=async(req,res)=>
{
    const role = req.headers["role"];

    console.log("📌 Role from header:", role);
 


}
module.exports =addSweets;