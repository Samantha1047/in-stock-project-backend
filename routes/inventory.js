import express from "express";
import * as inventoryControllers from "../controllers/inventory.js";
const router = express.Router();

router.route("/")
    .get(inventoryControllers.getInventory)

router.route("/:id")
    .get(inventoryControllers.getOneInventory)

export default router;