
const express = require("express");
const router = express.Router();
const Register=require("../controllers/Register")
const Login=require("../controllers/login")
// Route: POST /api/auth/register

router.post("/Register",Register);
router.post("/login",Login);
module.exports = router;

