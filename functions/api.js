import express from "express";
import ServerlessHttp from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const port = process.env.PORT || 8000;
const handler = ServerlessHttp(app);

module.exports.handler = async (event, context) => {
  return handler(event, context);
};

const app = express();
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

app.get("/api/:operation/:a/:b", calculate);
app.post("/api/:operation/:a/:b", calculate);

// app.listen(port, () => console.log(`Server listening on port ${port}!`));

// •	You should handle at least the following errors with appropriate responses:
// o	Division by zero.
// o	Using non-supported HTTP methods.
