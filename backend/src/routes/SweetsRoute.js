const express =require("express")
const router=express.Router();
// const addSweets=require("../controllers/Sweets")
const addSweets=require("../controllers/Sweets")
router.post("/",addSweets)
module.exports=router;