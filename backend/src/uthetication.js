const express=require("express");
const jwt=require('jsonwebtoken');

const veryfieauth=(req,res,next)=>{
     

    // console.log(req.headers["authorization"]);
    jwt.verify(req.headers["authorization"],"mydrive#@qwert123",(err,user)=>{
       
       
         

       if(err)
       {
        return res.status(403).json({ error: "Invalid token" });
       }
        req.user=user;
        
        next();

        
    });
   

}
module.exports=veryfieauth;