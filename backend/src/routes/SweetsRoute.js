const express =require("express")
const router=express.Router();

const {addSweets,getSweets,searchSweets,updateSweet,deleteSweet}=require("../controllers/Sweets")

const verify=require("../uthetication")
router.post("/",verify,addSweets)
router.get("/",verify,getSweets)
router.get("/search", verify, searchSweets);
router.put("/:id", verify, updateSweet);
router.delete("/:id", verify, deleteSweet);


module.exports=router;