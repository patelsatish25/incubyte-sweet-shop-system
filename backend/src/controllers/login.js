const bcrypt = require("bcryptjs");
// const UserAccount = require("../model/UserModel");
const UserAccount =require("../model/UserModel")
const jwt = require("jsonwebtoken");

const login = async (req, res) => {

    try
    {

    
  const { username, password } = req.body;
  console.log(username)
   // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }
 // Find user by username
//   const user = await UserAccount.findOne({ username);
//   = await UserAccount.findOne({ username })
  const user = await UserAccount.findOne({ username });

  console.log(user)
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password." });
  }
  
  const token = jwt.sign(
    { id: user._id, role: user.role },
    "mydrive#@qwert123",
    { expiresIn: "1h" }
  );

 

}catch(error)
{
    console.error("❌ Registration error:", error.message);
  return res.status(520).json({ error: error });
}
}
module.exports= login;