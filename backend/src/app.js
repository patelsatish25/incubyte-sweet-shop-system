const express=require("express");
const app=express();
const authRouter=require("./routes/Auth")
const SweetRouter=require("./routes/SweetsRoute")
const InventoryRouter=require("./routes/inventoryRoute")
const cors = require("cors");
app.use(cors())
app.use(express.json())
app.use("/api/auth",authRouter)

app.use("/api/sweets",SweetRouter)
app.use("/api/sweets",InventoryRouter)
app.listen(5000, () => {
    console.log(`Server is running at http://localhost:5000`);
  });
module.exports = app;
