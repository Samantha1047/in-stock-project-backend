import initKnex from 'knex'
import configuration from '../knexfile.js'
import { body, validationResult } from 'express-validator'

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

const editOneInventory = [
    body('warehouse_id').notEmpty().withMessage('A warehouse ID is required'),
    body('item_name').notEmpty().withMessage('A name is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('category').notEmpty().withMessage('Category is required.'),
    body('status').notEmpty().withMessage('Status is required.'),
    body('quantity').isInt().withMessage('Quantity must be a number.'),

    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { id } = req.params
        const { warehouse_id, item_name, description, category, status, quantity } =
            req.body

        try {
            const existingInventory = await knex('inventories').where({ id }).first()
            if (!existingInventory) {
                return res.status(404).send('Inventory item not found')
            }
            const existingWarehouse = await knex('warehouses')
                .where({ id: warehouse_id })
                .first()
            if (!existingWarehouse) {
                return res.status(400).json({ message: 'Invalid Warehouse ID' })
            }

            await knex('inventories').where({ id }).update({
                warehouse_id,
                item_name,
                description,
                category,
                status,
                quantity
            })
            const updatedInventory = await knex('inventories')
                .where({ id })
                .select(
                    'id',
                    'warehouse_id',
                    'item_name',
                    'description',
                    'category',
                    'status',
                    'quantity'
                )
                .first()

            res.status(200).json(updatedInventory)
        } catch (error) {
            res.status(500).send(`Error updating inventory: ${error.message}`)
        }
    }
]

export { getInventory, getOneInventory, editOneInventory }
