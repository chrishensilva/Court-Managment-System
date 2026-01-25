import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* Add Todo */
app.post("/todos", (req, res) => {
  const { task, date, time } = req.body;

  const sql = "INSERT INTO todo (task, date, time) VALUES (?, ?, ?)";
  db.query(sql, [task, date, time], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, task, date, time });
  });
});

/* Get Todos */
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todo ORDER BY id DESC", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

/* Delete Todo */
app.delete("/todos/:id", (req, res) => {
  db.query("DELETE FROM todo WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Deleted");
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
