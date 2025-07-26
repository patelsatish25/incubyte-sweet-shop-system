const bcrypt = require("bcryptjs");
const UserAccount = require("../model/UserModel");

const Login = async (req, res) => {
  const { username, password } = req.body;
  
  
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }
}
module.exports= Login;