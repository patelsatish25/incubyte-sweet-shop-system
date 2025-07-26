const express=require("express");
const app=express();
const authRouter=require("./routes/Auth")
const SweetRouter=require("./routes/SweetsRoute")
const InventoryRouter=require("./routes/inventoryRoute")
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/sweets",SweetRouter)
app.use("/api/sweets",InventoryRouter)
module.exports = app;
