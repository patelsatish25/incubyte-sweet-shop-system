const jwt = require("jsonwebtoken");
const UserAccount = require("../src/model/UserModel"); 
const mongoser = require("./setUp");
const app = require("../src/app");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const Sweets=require("../src/model/SweetModels")
const generateTestToken = async (role = "user") => {
 

  const passwordencyp = await bcrypt.hash("123456", 10); // Encrypt password
  await UserAccount.create({
    username: "testuser",
    email: "test@example.com",
    password: passwordencyp,
    role: "adimn" // Simulating an admin user (note: typo 'adimn')
  });

  await Sweets.insertMany([
    {
     
      name: "Kaju Katli",
      category: "Barfi",
      price: 250,
      quantityInStock: 100,
    },
    {
      
        name: "Milk Chocolate",
        category: "Chocolate",
        price: 180,
        quantityInStock: 50,
      }
  ]);
  const auth = await request(app) // Login request
    .post("/api/auth/login")
    .send({
      username: "testuser",
      password: "123456",
    });

  return auth.body.token;
};

module.exports = { generateTestToken };
