import express from "express";
import serverlessHttp from "serverless-http";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const API = "/.netlify/functions/api";

// app.get(API, (req, res) => {
//   return res.json({
//     message: "Hello World",
//   });
// });

const handler = serverlessHttp(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};

// app.get("/.netlify/functions/api/:operation/:a/:b/", calculate);

// const API = "/.netlify/functions/api";

// app.use(express.static(path.join(__dirname, "../../public")));

// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "../../public", "404.html"));
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../public", "index.html"));
// });

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
