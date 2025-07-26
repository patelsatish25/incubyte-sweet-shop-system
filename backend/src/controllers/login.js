const bcrypt = require("bcryptjs");
const UserAccount = require("../model/UserModel");

const Login = async (req, res) => {
  const { username, password } = req.body;
}
module.exports= Login;