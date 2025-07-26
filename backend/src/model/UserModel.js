const mongoose = require("mongoose");
//schema of userAccount
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
  }
});
// store userSchema into userAccount and export the Useraccount
let UserAccount = mongoose.model("UserAccount", userSchema);

module.exports=UserAccount;