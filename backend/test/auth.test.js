const request = require("supertest");
const app = require("../src/app");

describe("Auth: Register API", () => {
  
  /** @test
   * It should return 400 if required fields are missing.
   */
  it("should return 400 when username, name, or phone is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({}); // Empty body

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Missing required fields" });
  });
  
  
  


});
