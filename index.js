import express from "express";
import cors from "cors";
import "dotenv/config";
import warehouseRoutes from "./routes/warehouse.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("This is a homePage for In-Stock Project API, please make a request!");
});

app.use("/warehouse", warehouseRoutes);

app.listen(PORT, () => {
  console.log("App is running on port ", PORT);
});
