// const request = require("supertest");
const mongoose =require("mongoose")
const mongodb = require("../src/mongodbcon");


describe("MongoDB Connection Utility", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should connect to MongoDB successfully", async () => {
      // Mock mongoose.connect to resolve
      jest.spyOn(mongoose, "connect").mockResolvedValueOnce();
  
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  
      await connectToDatabase();
  
      expect(mongoose.connect).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith("✅ MongoDB connected successfully");
    });
});