const express =require("express")
const Router=express.Router();
const addSweets=express.Router();
Router.post("/",addSweets)
module.exports=Router;