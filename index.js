import express from "express";
import cors from "cors";
import "dotenv/config";
import warehouseRoutes from "./routes/warehouse.js";
import inventoryRoutes from "./routes/inventory.js"

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send(
    "This is a homePage for In-Stock Project API, please make a request!"
  );
});

app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventories", inventoryRoutes)

app.listen(PORT, () => {
  console.log("App is running on port ", PORT);
});
