import express from "express";
import * as warehouseControllers from "../controllers/warehouse.js";
const router = express.Router();


router
  .route("/")
  .get(warehouseControllers.getWarehouses)
  .post(warehouseControllers.postOneWarehouse);
router
  .route("/:id")
  .get(warehouseControllers.getOneWarehouse)
  .put(warehouseControllers.editOneWarehouse)
.delete(warehouseControllers.deleteWarehouse);

router
  .route("/:id/inventories")
  .get(warehouseControllers.getInventoryByWarehouseId);


export default router;
