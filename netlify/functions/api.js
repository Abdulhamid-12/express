import express from "express";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const API = "/.netlify/functions/api";

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const calculate = (req, res) => {
  const op = req.params.operation;
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  if (isNaN(a) || isNaN(b)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  let result;
  switch (op) {
    case "add":
      result = a + b;
      res.status(200).json({ operation: op, result: result, inputs: [a, b] });
      break;
    case "subtract":
      result = a - b;
      res.status(200).json({ operation: op, result: result, inputs: [a, b] });
      break;

    case "multiply":
      result = a * b;
      res.status(200).json({ operation: op, result: result, inputs: [a, b] });
      break;
    case "divide":
      if (b === 0) {
        res.status(400).json({ error: "Cannot divide by zero" });
        return;
      }
      result = a / b;
      res.status(200).json({ operation: op, result: result, inputs: [a, b] });
      break;
    default:
      res.status(400).json({ error: "Invalid operation" });
  }
};

app.all(`${API}/:operation/:a/:b`, (req, res, next) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  next();
});

app.get(`${API}/:operation/:a/:b`, calculate);
app.post(`${API}/:operation/:a/:b`, calculate);

export const handler = serverless(app);
