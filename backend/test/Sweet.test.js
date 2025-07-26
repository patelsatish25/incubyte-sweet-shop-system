
const request = require("supertest");


const app = require("../src/app");


const mongoser = require("./setUp");

const Sweet = require("../src/model/SweetModels");

const bcrypt = require("bcryptjs");

const UserAccount = require("../src/model/UserModel");

// Test suite for sweet addition API
describe("add sweets: /api/sweets", () => {

});
