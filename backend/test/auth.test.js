const request = require("supertest");
const app = require("../src/app");

describe("Auth: Register API", () => {
  
  /**
   * @test
   * It should return 400 if required fields are missing.
   */
  it("should return 400 when username, name, or phone is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({}); // Empty body

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Missing required fields" });
  });

  /**
   * @test
   * It should return 409 if the username is already taken.
   */
  it("should return 409 when the username is already used", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "satish@123", // Already taken in mock
        name: "Satish",
        phone: 200
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ error: "Username is already used" });
  });

});
