import express from "express";
import serverlessHttp from "serverless-http";

const app = express();
const API = "/.netlify/functions/api";

const handler = serverlessHttp(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};

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

app.get(`${API}/:operation/:a/:b`, calculate);
app.post(`${API}/:operation/:a/:b`, calculate);

app.all(`${API}/:operation/:a/:b`, (req, res, next) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
  }
  next();
});
