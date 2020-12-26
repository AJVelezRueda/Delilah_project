const { Sequelize, QueryTypes } = require("sequelize");

const db = new Sequelize('test', 'root', 'CULO1234', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

async function clean() {
    await db.query("truncate products", { type: QueryTypes.BULKDELETE });
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
    res.json(await findProductById(Number(req.params.id)))
        .status(200);
}

async function create(req, res) {
    const products = {
        name: req.body.name,
        price: req.body.price,
    };

    const result = await db.query(`
        insert into products (name, price) values (:name, :price)
    ` , {
        replacements: products,
        type: QueryTypes.INSERT
    });

    res.json({ id: result[0] }).status(201);
}

async function update(req, res) {
    const id = Number(req.params.id)

    await findProductById(id);

    const product = {
        id,
        name: req.body.name,
        price:  req.body.price
    }

    await db.query(`
        update products set name = :name, price = :price where id = :id
    ` , {
        replacements: product,
        type: QueryTypes.UPDATE
    });

    res.status(200).end();
}

async function remove(req, res) {
    await deleteProductById(Number(req.params.id));

    res.status(200).end();
}

module.exports = {
    clean,
    listAll,
    get,
    create,
    update,
    remove,
};