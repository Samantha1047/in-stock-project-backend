import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import express from "express";
const router = express.Router();

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const warehouse = await knex("warehouses").where("id", req.params.id);

    if (warehouse.length === 0) {
      return res.status(404).send("Warehouse not found");
    }
    const formattedData = warehouse.map((warehouse) => {
      return {
        id: warehouse.id,
        warehouse_name: warehouse.warehouse_name,
        address: warehouse.address,
        city: warehouse.city,
        country: warehouse.country,
        contact_name: warehouse.contact_name,
        contact_position: warehouse.contact_position,
        contact_phone: warehouse.contact_phone,
        contact_email: warehouse.contact_email,
      };
    });
    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err + " :Error getting warehouse data");
  }
});

export default router;
