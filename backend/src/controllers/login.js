const bcrypt = require("bcryptjs");
const UserAccount = require("../model/UserModel");

const Login = async (req, res) => {
  const { username, password } = req.body;
  
   // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }
 // Find user by username
  const user = await UserAccount.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password." });
  }
  

}
module.exports= Login;