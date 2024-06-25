import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getInventory = async (_req, res) => {
    try {
        const data = await knex("inventories")
            .join("warehouses", "inventories.warehouse_id", "warehouses.id")
            .select(
                "inventories.id",
                "inventories.item_name",
                "inventories.description",
                "inventories.category",
                "inventories.status",
                "inventories.quantity",
                "warehouses.warehouse_name as warehouse_name");

        const formattedData = data.map((inventory) => {
            return {
                id: inventory.id,
                warehouse_name: inventory.warehouse_name,
                item_name: inventory.item_name,
                description: inventory.description,
                category: inventory.category,
                status: inventory.status,
                quantity: inventory.quantity
            };
        });
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(400).send(`Error retrieving Inventories: , ${error}`)
    }
};

export { getInventory };
