const express=require("express")
//connect mongodb connection
const bcrypt = require("bcryptjs")
const mongoconnect=require("../mongodbcon")
const UserAccount =require("../model/UserModel")

if (process.env.NODE_ENV !== "test") {
  mongoconnect();
}
const Register = async(req, res) => {
  try
  {
    const { username, email, password,role} = req.body;
  
    // 1. Check for missing fields
    if (!username || !email || !password||!role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    //1. check Duplicate data
    const veryfie = await UserAccount.findOne({ username })
    // console.log(veryfie);
    if (veryfie) {
      // return res.status(500).json({ error: "Username is already used" });
      console.log("✅ Duplicate user found. Sending error...");
  return res.status(500).json({ error: "Username is already used" });
  }

  // ✅ Step 3: Hash password using bcrypt
  const passwordencyp = await bcrypt.hash(password, 10);

  // ✅ Step 4: Create and save new user
  const user = new UserAccount({
    username,
    email,
    password: passwordencyp,
    role
  });

  await user.save();

  // ✅ Step 5: Return success response
  return res.status(201).json({ message: "User registered successfully" });
}catch(error) {
  console.error("❌ Registration error:", error.message);
  return res.status(520).json({ error: error });
}
    
};
  

  module.exports = Register;
  