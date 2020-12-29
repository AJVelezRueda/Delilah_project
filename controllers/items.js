const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate items", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}

async function create(req, res) {
    const items = req.body.items;

    items.forEach(item => {
        const newItem = {
            product_id: item.product_id,
            cantidad: item.cantidad,
            order_id: item.order_id
        };

        try {
            const result = await db.query(`
            insert into items (product_id, cantidad, order_id) 
                        values (:product_id, :cantidad, :order_id)
        `, {
                replacements: newItem,
                type: QueryTypes.INSERT
            });
            res.json({ id: result[0] }).status(201);
        } catch (e) {
            res.json({ message: e.message }).status(500);
        }
    });
}


async function findItemById(order_id) {
    const items = await db.query(`select * from items where order_id = :order_id`, {
        replacements: { order_id: order_id },
        type: QueryTypes.SELECT
    });

    if (items.length === 0) {
        throw new Error('No existe hay items cargados');
    }

    return items[0];
}

async function get(req, res) {
    try {
        res.json(await findItemById(req.params.id))
            .status(200);
    } catch (e) {
        res.json({ message: e.message }).status(500);
    };
}

module.exports = {
    clean,
    create,
    get
};