const express=require("express")
//connect mongodb connection
const mongoconnect=require("../mongodbcon")
const UserAccount =require("../model/UserModel")

mongoconnect();
const Register = async(req, res) => {
    const { username, name, phone} = req.body;
  
    // 1. Check for missing fields
    if (!username || !name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const veryfie = await userAccount.findOne({ username })
    console.log(veryfie);
    if (veryfie) { res.status(500).json({ msg: "allredy exists" }) }

    
};
  

  module.exports = Register;
  