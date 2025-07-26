const request = require("supertest");
const app = require("../src/app");
const mongoser=require("./setUp")
const UserAccount=require("../src/model/UserModel")
describe("Auth: Register API", () => {
  
  /** @test
   * It should return 400 if required fields are missing.
   */
  it("should return 400 when username, name, or password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({}); // Empty body

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Missing required fields" });
  });
  it("should return 500 if username is already taken", async () => {
    await UserAccount.create({
      username: "satish@123",
      email: "satish@example.com",
      password: 123456,
    });
  
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "satish@123", // Duplicate
        email: "another@example.com",
        password: 987654,
      });
  
    expect(response.statusCode).toBe(500);
     expect(response.body).toEqual({ error: "Username is already used" });
  }, 10000);

  
  


});
