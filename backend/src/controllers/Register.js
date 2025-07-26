const express=require("express")
//connect mongodb connection
const mongoconnect=require("../mongodbcon")
const UserAccount =require("../model/UserModel")

if (process.env.NODE_ENV !== "test") {
  mongoconnect();
}
const Register = async(req, res) => {
    const { username, email, password} = req.body;
  
    // 1. Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    //1. check Duplicate data
    const veryfie = await UserAccount.findOne({ username })
    console.log(veryfie);
    if (veryfie) {
      // return res.status(500).json({ error: "Username is already used" });
      console.log("✅ Duplicate user found. Sending error...");
  return res.status(500).json({ error: "Username is already used" });


  }
    
  
    
};
  

  module.exports = Register;
  