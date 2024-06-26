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

const postOneInventory = [
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
        const { warehouse_id, item_name, description, category, status, quantity } =
            req.body

        try {
            const warehouseExists = await knex('warehouses')
                .where('id', warehouse_id)
                .first()

            if (!warehouseExists) {
                return res.status(400).json({ message: 'Invalid Warehouse ID' })
            }

            const newInventory = await knex('inventories').insert({
                warehouse_id,
                item_name,
                description,
                category,
                status,
                quantity
            })

            const newInventoryId = newInventory[0]

            const createdInventory = await knex('inventories')
                .where({ id: newInventoryId })
                .first()

            res.status(201).json(createdInventory)
        } catch (error) {
            res.status(500).send(`Error creating inventory: ${error.message}`)
        }
    }
]

export { getInventory, getOneInventory, postOneInventory }
