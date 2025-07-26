const express=require("express");
const app=express();
const authRouter=require("./routes/Auth")
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/sweet")
module.exports = app;
