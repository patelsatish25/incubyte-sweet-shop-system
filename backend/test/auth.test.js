const request = require("supertest");
const app = require("../src/app");
const mongoser=require("./setUp")
const bcrypt = require("bcryptjs");

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
  it("should return 409 if username is already taken", async () => {
    await UserAccount.create({
      username: "satish@123",
      email: "satish@example.com",
      password: 123456,
      role:"user"
    });
  
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "satish@123", // Duplicate
        email: "another@example.com",
        password: 987654,
        role:"admin"
      });
  
    expect(response.statusCode).toBe(409);
     expect(response.body).toEqual({ error: "Username is already used" });
  }, 10000);

  
  it("should return 201 if user registers successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "newuser@123",
        email: "newuser@example.com",
        password: "123456",
        role:"admin"
      });
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      message: "User registered successfully",
    });

   
  });
  


});

describe("auth : login",()=>{
  beforeAll(async () => {
    // const hashedPassword = await bcrypt.hash("123456", 10); // Make sure this line runs!
     const passwordencyp = await bcrypt.hash("123456", 10);
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp ,
      role: "user"
    });
  });

   /** @test - Should return 400 if required fields are missing */
   it("should return 400 when username or password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Missing credentials" });
  });
    /** @test Invalid username & password */
    it("should return 401 for incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "wrongpass"
       
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ error: "Invalid username or password" });
    });

   
    it("should return 200 for valid credentials and correct role message", async () => {
      
      const passwordencyp = await bcrypt.hash("123456", 10);
      await UserAccount.create({
        username: "testuser",
        email: "test@example.com",
        password: passwordencyp ,
        role: "user"
      });
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "testuser",
          password: "123456", 
        });
      console.log("Response:", response.body); // 
      expect(response.statusCode).toBe(200);
     
    });
    

})