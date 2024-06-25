import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getWarehouses = async (_req, res) => {
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
};

const getOneWarehouse = async (req, res) => {
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
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

export { getWarehouses, getOneWarehouse };
