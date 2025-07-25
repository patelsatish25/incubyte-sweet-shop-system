
const express = require("express");
const router = express.Router();
const Register=require("../controllers/Register")

// Route: POST /api/auth/register

router.post("/Register",Register);
module.exports = router;

