// const UserAccount = require('./model/UserAccount');
const UserAccount=require("../model/UserModel")
const  getuser=async(req,res)=>
{

   
  try {
    const user = await UserAccount.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({name:user.username,email:user.email});

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports=getuser;