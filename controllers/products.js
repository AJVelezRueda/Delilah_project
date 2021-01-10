const { QueryTypes } = require("sequelize");
const { db, getResourceById, getAllResources, deleteResoueceById, cleanTable } = require("../database");

async function clean() {
    cleanTable('products');
};

async function findProductById(id) {
    return await getResourceById('products', id);
}

async function deleteProductById(id) {
    await deleteResoueceById('products', id);
}

async function listAll(req, res) {
    const products = await getAllResources('products');
    res.json({ products }).status(200);
}

async function get(req, res) {
    try {
        res.json(await findProductById(Number(req.params.id)))
            .status(200);
    } catch (e) {
        res.status(500).json({ message: e.message });
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

        res.status(201).json({ id: result[0] });
    } catch (e) {
        res.status(500).json({ message: e.message });
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
            res.status(500).json({ message: e.message });
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