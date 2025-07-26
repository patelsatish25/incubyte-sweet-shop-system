
const request = require("supertest");


const app = require("../src/app");


const mongoser = require("./setUp");

const Sweet = require("../src/model/SweetModels");

const bcrypt = require("bcryptjs");

const UserAccount = require("../src/model/UserModel");
const {generateTestToken}=require("./testUtils")

async function  getsweetId ()
{
  const sweet = await Sweet.create({
    sweetId: "SWEET004",
    name: "Test Barfi",
    category: "Barfi",
    price: 150,
    quantityInStock: 50,
  });

  return sweet.__id;
}


// Test suite for sweet addition API
describe("add sweets: /api/sweets", () => {

  // Test case: Should reject if no token is provided (unauthorized access)
  it("shoude return 403 for invelid token", async () => {
    const passwordencyp = await bcrypt.hash("123456", 10); // Encrypt password
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp,
      role: "adimn" // Simulating an admin user (note: typo 'adimn')
    });

    const auth = await request(app) // Login request
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

    const sweetData = { // Sweet payload to test API
      sweetId: "SWEET001",
      name: "Kaju Katli",
      category: "Barfi",
      price: 250,
      quantityInStock: 100
    };

    const response = await request(app).post("/api/sweets").send(sweetData);
    expect(response.statusCode).toBe(403); // Expecting forbidden without valid token
  });

  // Test case: Should reject if required fields are missing
  it("should return 400 for missing fields", async () => {
    const passwordencyp = await bcrypt.hash("123456", 10);
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp,
      role: "admin"
    });

    const auth = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", auth.body.token) // Send token in headers
      .set("role", auth.body.role) // Custom role header
      .send({}); // Empty request body

    expect(response.statusCode).toBe(400); // Missing data should return 400
    expect(response.body).toEqual({ error: "Missing required sweet fields" });
  });

  // Test case: Should allow admin to add a sweet with valid data
  it("should return 201 and save sweet when data is valid", async () => {
    const passwordencyp = await bcrypt.hash("123456", 10);
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp,
      role: "admin"
    });

    const auth = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

    console.log("Response:", auth.body.token); // Debugging token

    const sweetData = {
      sweetId: "SWEET001",
      name: "Kaju Katli",
      category: "Barfi",
      price: 250,
      quantityInStock: 100
    };

    const response = await request(app).post("/api/sweets")
      .set("role", auth.body.role)
      .set("Authorization", auth.body.token)
      .send(sweetData);

    expect(response.statusCode).toBe(201); // Created successfully

    
  });

  // Test case: Should reject normal user from adding sweets (admin-only access)
  it("should return 403 for access user", async () => {
    const passwordencyp = await bcrypt.hash("123456", 10);
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp,
      role: "user" // Not admin
    });

    const auth = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

    console.log("Response:", auth.body.token); // Debugging token

    const sweetData = {
      sweetId: "SWEET001",
      name: "Kaju Katli",
      category: "Barfi",
      price: 250,
      quantityInStock: 100
    };

    const response = await request(app).post("/api/sweets")
      .set("role", auth.body.role)
      .set("Authorization", auth.body.token)
      .send(sweetData);

    expect(response.statusCode).toBe(403); // User not allowed to add sweets
  });

});

describe("get sweets: GET /api/sweets",()=>{

 

  
  it("should return 403 if no token is provided", async () => {
    
    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "Invalid token" });
  });
  
  it("should return 403 if token is invalid", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", "Bearer invalidtoken123");
      
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "Invalid token" });
  });

  it("should return empty array if no sweets in DB", async () => {
    
 
    const passwordencyp = await bcrypt.hash("123456", 10);
    
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp,
      role: "user"
    });
  
    const auth = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

     

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", auth.body.token)
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 and list of sweets with valid token", async () => {
   
    const passwordencyp = await bcrypt.hash("123456", 10);
    // Mock login or manually generate token
    await UserAccount.create({
      username: "testuser",
      email: "test@example.com",
      password: passwordencyp,
      role: "user"
    });
  
    const auth = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

      await Sweet.create({
        sweetId: "SWEET101",
        name: "Rasgulla",
        category: "Ladoo",
        price: 180,
        quantityInStock: 50
      });
    
  
      const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", auth.body.token)
      console.log(res.body)
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
})

describe("GET /api/sweets/search (with auth)", () => {
  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/api/sweets/search?name=kaju");
    expect(res.status).toBe(403);
  });

  it("should return 403 for invalid token", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=kaju")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.status).toBe(403);
  });

  it("should return sweets if valid token is provided", async () => {
    let token =await generateTestToken()
    const res = await request(app)
      .get("/api/sweets/search?name=kaju")
      .set("Authorization",token );
      console.log(res)
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Kaju Katli");
  });

  it("should return sweets matching exact category", async () => {
    let token =await generateTestToken()
    const res = await request(app).get("/api/sweets/search?category=Chocolate").set("Authorization",token );
    console.log(res.body)
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe("Chocolate");
  });

  it("should return sweets in given price range", async () => {
    let token =await generateTestToken()
    const res = await request(app).get("/api/sweets/search?minPrice=100&maxPrice=200").set("Authorization",token );
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Milk Chocolate");
  });
  it("should return sweets matching name and category", async () => {
    let token =await generateTestToken()
    const res = await request(app).get("/api/sweets/search?name=katli&category=Barfi").set("Authorization",token );
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Kaju Katli");
  });
  
  it("should return empty array if no match found", async () => {
    let token =await generateTestToken()
    const res = await request(app).get("/api/sweets/search?name=laddu").set("Authorization",token );
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });


})

describe("PUT /api/sweets/:id",() => {

  it("should update the sweet details if valid token and data provided", async () => {
    let token=await generateTestToken()
    // let id=await Sweet.find({"name":"Milk Chocolate"},{_id:1})
    let sweet = await Sweet.findOne({ name: "Milk Chocolate" }, { _id: 1 });
let id = sweet._id;
    console.log(id)
    const res = await request(app)
      .put(`/api/sweets/${id}`)
      .set("Authorization", token)
      .send({
        price: 150,
        quantityInStock: 60,
      });

    expect(res.status).toBe(200);
   
  });

  it("should return 403 if no token provided", async () => {
    
    await Sweet.create({
      name: "Kaju Katli",
      category: "Barfi",
      price: 250,
      quantityInStock: 100,
    });
    let sweets = await Sweet.findOne({ name: "Kaju Katli" }, { _id: 1 });
    
    console.log(sweets)
    let id = sweets._id;
   
    const res = await request(app)
      .put(`/api/sweets/${id}`)
      .send({ price: 120 });
  
    expect(res.status).toBe(403); // 🔄 Adjust if needed
  });


  it("should return 403 for invalid token", async () => {
   
    await Sweet.create({
      name: "Kaju Katli",
      category: "Barfi",
      price: 250,
      quantityInStock: 100,
    });
    let sweets = await Sweet.findOne({ name: "Kaju Katli" }, { _id: 1 });
    
    console.log(sweets)
    let id = sweets._id;
    const res = await request(app)
      .put(`/api/sweets/${id}`)
      .set("Authorization", "Bearer faketoken123")
      .send({ price: 120 });

    expect(res.status).toBe(403);
  });

 
});




