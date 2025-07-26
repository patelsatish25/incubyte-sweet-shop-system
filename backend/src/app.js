const express=require("express");
const app=express();
const authRouter=require("./routes/Auth")
const SweetRouter=require("./routes/SweetsRoute")
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/sweet",SweetRouter)

module.exports = app;
