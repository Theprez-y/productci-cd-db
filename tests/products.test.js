import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";
import { pool } from "../db/db.js";

before(async () => {
  await pool.query("DELETE FROM products");

  await pool.query(`
    INSERT INTO products (name, price)
    VALUES
      ('Rice', 5000),
      ('Beans', 4000)
  `);
});

after(async () => {
  await pool.end();
});

test("GET /products returns products", async () => {
  const response = await request(app).get("/products");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("GET /products/:id returns a product", async () => {
  const response = await request(app).get("/products/1");

  assert.equal(response.status, 200);
  assert.equal(response.body.name, "Rice");
});

test("GET /products/:id returns 404 for missing product", async () => {
  const response = await request(app).get("/products/9999");

  assert.equal(response.status, 404);
});