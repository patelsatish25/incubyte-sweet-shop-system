const request = require("supertest");
const app = require("../src/app");
const mongoser=require("./setUp")
const Sweet=require("../src/model/SweetModels")
describe("POST /api/sweets", () => {
it("should return 400 for missing fields", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .send({}); // Send empty body

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Missing required sweet fields" });
  });
})