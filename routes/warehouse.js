import express from "express";
import * as warehouseControllers from "../controllers/warehouse.js";
const router = express.Router();


router.route("/").get(warehouseControllers.getWarehouses);
router.route("/:id").get(warehouseControllers.getOneWarehouse);


export default router;
