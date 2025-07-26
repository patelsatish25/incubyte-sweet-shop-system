const express =require("express")
const router=express.Router();

const {addSweets,getSweets,searchSweets}=require("../controllers/Sweets")
const verify=require("../uthetication")
router.post("/",verify,addSweets)
router.get("/",verify,getSweets)
router.get("/search", verify, searchSweets);
module.exports=router;