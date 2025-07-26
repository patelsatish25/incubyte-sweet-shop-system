
const request = require("supertest");

const mongoose=require("mongoose")
const app = require("../src/app");


const mongoser = require("./setUp");

const Sweet = require("../src/model/SweetModels");

const bcrypt = require("bcryptjs");

const UserAccount = require("../src/model/UserModel");
const {generateTestToken}=require("./testUtils")

async function getproductid()
{
    const sweet = await Sweet.create({
        sweetId: "SWEET999",
        name: "Test Rasgulla",
        category: "Ladoo",
        price: 100,
        quantityInStock: 10,
      });
    return  sweet._id;
}

describe("POST /api/sweets/:id/purchase", () => {
 
  
  });