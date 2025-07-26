const express =require("express")
const router=express.Router();
const {purchaseSweet}=require("../controllers/Inventory")

const verify=require("../uthetication")


router.post("/:id/purchase", verify, purchaseSweet);

module.exports=router