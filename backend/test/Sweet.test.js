
const request = require("supertest");


const app = require("../src/app");


const mongoser = require("./setUp");

const Sweet = require("../src/model/SweetModels");

const bcrypt = require("bcryptjs");

const UserAccount = require("../src/model/UserModel");

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

    // Optional DB checks commented out
    // const sweet = await Sweet.findOne({ sweetId: "SWEET001" });
    // expect(sweet).not.toBeNull();
    // expect(sweet.name).toBe("Kaju Katli");
    // expect(sweet.price).toBe(250);
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
