
const express = require("express");
const router = express.Router();
const Register=require("../controllers/Register")
const login=require("../controllers/login")
const getuser=require("../controllers/user")
const verify=require("../uthetication")
// Route: POST /api/auth/register

router.post("/Register",Register);
router.post("/login",login);
router.get("/user",verify ,getuser);
module.exports = router;

