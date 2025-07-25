const express =require("express");
// const app=express()
const Router=express.Router();
const Register=require("../controllers/Register")
Router.post("/Register",Register)
// Router.post()
module.exports=Router;
