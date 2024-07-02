import express from "express";
import * as inventoryControllers from "../controllers/inventory.js";
const router = express.Router();

router.route("/").get(inventoryControllers.getInventory).post(inventoryControllers.postOneInventory);

router.route("/:id").get(inventoryControllers.getOneInventory).put(inventoryControllers.editOneInventory).delete(inventoryControllers.deleteInventory);

router.route("/:id").get(inventoryControllers.getOneInventory);

export default router;
