import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";

// Initialize Express App
const app = express();

// Import the TypeScript script dynamically
import("./lambdaProcessor")
  .then(() => {
    console.log("Table creation script executed successfully.");
  })
  .catch((error) => {
    console.error("Error executing table creation script:", error);
  });

// Define a route that responds with 'Hello, World!' when accessed
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Set the app to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
