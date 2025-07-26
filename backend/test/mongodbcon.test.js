// const request = require("supertest");
const mongoose =require("mongoose")
const connectToDatabase= require("../src/mongodbcon");


describe("MongoDB Connection Utility", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should connect to MongoDB successfully", async () => {
      // Mock mongoose.connect to resolve
  
  
       const msg= await connectToDatabase();
       expect(msg).toBe("success")
     
    });

   
});