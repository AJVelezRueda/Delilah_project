const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate products", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}

async function findProductById(id) {
    const products = await db.query(`select * from products where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    if (products.length === 0) {
        throw new Error('No existe el usuario');
    }

    return products[0];
}

async function deleteProductById(id) {
    await db.query(`delete from products where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}

async function listAll(req, res) {
    const products = await db.query("select * from products", { type: QueryTypes.SELECT });
    res.json({ products }).status(200);
}

async function get(req, res) {
    try {
        res.json(await findProductById(Number(req.params.id)))
            .status(200);
    } catch (e) {
        res.json({ message: e.message }).status(500);
    };
}

async function create(req, res) {
    const products = {
        name: req.body.name,
        price: req.body.price,
    };

    try {
        const result = await db.query(`
            insert into products (name, price) values (:name, :price)
        `, {
            replacements: products,
            type: QueryTypes.INSERT
        });

        res.json({ id: result[0] }).status(201);
    } catch (e) {
        res.json({ message: e.message }).status(500);
    }
}

async function update(req, res) {
    const id = Number(req.params.id);

    try {
        await findProductById(id);

        const product = {
            id,
            name: req.body.name,
            price: req.body.price
        }

        await db.query(`
            update products set name = :name, price = :price where id = :id
        `, {
            replacements: product,
            type: QueryTypes.UPDATE
        });

        res.status(200).end();
    } catch (e) {
        if (e.message == 'No existe el producto') {
            res.status(404).end();
        } else {
            res.status(500).end();
        }
    }

}

async function remove(req, res) {
    try {
        await deleteProductById(Number(req.params.id));
        res.status(200).end();
    } catch (e) {
        res.json({ message: e.message }).status(500);
    }

}

module.exports = {
    clean,
    listAll,
    get,
    create,
    update,
    remove,
};