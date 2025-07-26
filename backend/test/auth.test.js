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
  it("should return 500 if username is already taken", async () => {
   
  
    const response = await request(app).post("/api/auth/register").send({
      username: "satish@123", // duplicate
      name: "Another",
      phone: 9876543210,
    });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Username is already used" });
  });


  
  


});
