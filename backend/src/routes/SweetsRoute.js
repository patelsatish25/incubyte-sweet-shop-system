const express =require("express")
const router=express.Router();

const addSweets=require("../controllers/Sweets")
const verify=require("../uthetication")
router.post("/",verify,addSweets)
module.exports=router;