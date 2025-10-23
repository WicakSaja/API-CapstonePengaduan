import express from "express";
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/api-specs.json" with { type: "json" };

dotenv.config();
const app = express();
app.get('/', (req, res) => {
  res.json({ message: 'Capstone API is running.' });
});

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;