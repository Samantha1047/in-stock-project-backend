import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import express from "express";
const router = express.Router();


router.get("/", async (_req, res) => {
  try {
    const data = await knex("warehouses");
    const formattedData = data.map((warehouse) => {

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
    res.status(400).send(`Error retrieving Warehouses: ${err}`);

  }
});

export default router;
