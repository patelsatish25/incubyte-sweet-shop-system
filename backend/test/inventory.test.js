
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
 
  
    it("should purchase sweet and decrease stock if valid", async () => {
        let token=await generateTestToken();
        let sweetId=await getproductid();
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization",  token)
        .send({ quantity: 3 });
  
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successfully purchased 3 Test Rasgulla");
      expect(res.body.remainingStock).toBe(7);
  
      const updated = await Sweet.findById(sweetId);
      expect(updated.quantityInStock).toBe(7);
    });
  
    it("should return 403 if no token is provided", async () => {
      
        let sweetId=await getproductid();
        const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 2 });
  
      expect(res.status).toBe(403);
     
    });
  
    it("should return 403 for invalid token", async () => {
       
        let sweetId=await getproductid();
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", "Bearer faketoken")
        .send({ quantity: 2 });
  
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Invalid token");
    });
  
    it("should return 400 if quantity is missing", async () => {
        let token=await generateTestToken();
        let sweetId=await getproductid();
        const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization",token)
        .send({});
  
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Quantity must be a positive number");
    });
  
    it("should return 400 if quantity exceeds available stock", async () => {
        let token=await generateTestToken();
        let sweetId=await getproductid();
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", token)
        .send({ quantity: 20 });
  
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Not enough stock available");
    });
  
    it("should return 404 if sweet not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      let token=await generateTestToken();
      const res = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set("Authorization", token)
        .send({ quantity: 1 });
  
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Sweet not found");
    });
  });