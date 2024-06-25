import express from "express";
import * as inventoryControllers from "../controllers/inventory.js";
const router = express.Router();

router.route("/")
    .get(inventoryControllers.getInventory)

export default router;