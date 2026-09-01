const express = require("express");
const { pool } = require("../db/db.js");

const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id");

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "name and price are required",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [name, price],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      price,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { name, price } = req.body;

    const [result] = await pool.query(
      "UPDATE products SET name = ?, price = ? WHERE id = ?",
      [name, price, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      id: Number(req.params.id),
      name,
      price,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

module.export = app;