import initKnex from 'knex'
import configuration from '../knexfile.js'

const knex = initKnex(configuration)

const getInventory = async (_req, res) => {
    try {
        const inventory = await knex('inventories')
            .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
            .select(
                'inventories.id',
                'warehouses.warehouse_name',
                'inventories.item_name',
                'inventories.description',
                'inventories.category',
                'inventories.status',
                'inventories.quantity'
            )

        res.status(200).json(inventory)
    } catch (error) {
        res.status(400).send(`Error retrieving Inventories: , ${error}`)
    }
}

const getOneInventory = async (req, res) => {
    try {
        const inventory = await knex('inventories')
            .where('inventories.id', req.params.id)
            .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
            .select(
                'inventories.id',
                'warehouses.warehouse_name',
                'inventories.item_name',
                'inventories.description',
                'inventories.category',
                'inventories.status',
                'inventories.quantity'
            )

        if (inventory.length === 0) {
            return res.status(404).send('Inventory not found')
        }

        res.status(200).json(inventory)
    } catch (error) {
        res.status(400).send(`Error retrieving Inventory: ${error}`)
    }
}

export { getInventory, getOneInventory }
