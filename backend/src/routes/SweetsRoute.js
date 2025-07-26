const express =require("express")
const router=express.Router();

const {addSweets,getSweets}=require("../controllers/Sweets")
const verify=require("../uthetication")
router.post("/",verify,addSweets)
router.get("/",verify,getSweets)
module.exports=router;