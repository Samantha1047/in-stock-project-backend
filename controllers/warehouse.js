import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import { body, validationResult } from "express-validator";

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

const postOneWarehouse = [
  body("warehouse_name").notEmpty().withMessage("Warehouse name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("contact_name").notEmpty().withMessage("Contact name is required"),
  body("contact_position").notEmpty().withMessage("Contact position is required"),
  body("contact_phone")
    .notEmpty()
    .matches(/^\+\d{1,2}\s?\(\d{3}\)\s?\d{3}-\d{4}$/)
    .withMessage("Contact phone number is invalid"),
  body("contact_email").isEmail().withMessage("Contact email is invalid"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;
    try {
      const newWarehouse = await knex("warehouses").insert({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });

      const newWarehouseId = newWarehouse[0];
      const createWarehouse = await knex("warehouses").where({ id: newWarehouseId });
      res.status(201).json(createWarehouse);
    } catch (error) {
      res.status(500).send(`Error adding warehouse: ${error.message}`);
    }
  },
];

const editOneWarehouse = [
  body("warehouse_name").notEmpty().withMessage("Warehouse name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("contact_name").notEmpty().withMessage("Contact name is required"),
  body("contact_position").notEmpty().withMessage("Contact position is required"),
  body("contact_phone")
    .notEmpty()
    .matches(/^\+\d{1,2}\s?\(\d{3}\)\s?\d{3}-\d{4}$/)
    .withMessage("Contact phone number is invalid"),
  body("contact_email").isEmail().withMessage("Contact email is invalid"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;

    try {
      const existing = await knex("warehouses").where({ id });
      if (!existing) {
        return res.status(404).send("Warehouse not found");
      }

      await knex("warehouses").where({ id }).update({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });

      const updatedWarehouse = await knex("warehouses").where({ id });
      res.status(200).json(updatedWarehouse[0]);
    } catch (error) {
      res.status(500).send(`Error updating warehouse: ${error.message}`);
    }
  },
];

const deleteWarehouse = async (req, res) => {
  const { id } = req.params;
  try {
    await knex.transaction(async (trx) => {
      await trx("inventories").where({ warehouse_id: id }).delete();
      const warehouseDeleted = await trx("warehouses").where({ id }).delete();

      if (warehouseDeleted === 0) {
        res.status(404).json({ message: error.message });
      }

      res.sendStatus(204);
    });
  } catch (error) {
    res.status(500).json({ message: `Unable to delete warehouse: ${error.message}` });
  }
};

export { getWarehouses, getOneWarehouse, postOneWarehouse, editOneWarehouse, deleteWarehouse };
