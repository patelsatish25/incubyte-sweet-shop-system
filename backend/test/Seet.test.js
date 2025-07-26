const request = require("supertest");
const app = require("../src/app");

description("sweets:add",()=>{
  it("shoude be return for missing fields",()=>{
   const response= request(app).post("/api/sweets").send()
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Missing required sweet fields" });
  })
})