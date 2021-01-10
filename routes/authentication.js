const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    if (req.path === '/login' || req.path === '/users' && req.method === 'POST') {
        next();
        return;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);
        req.user_id = payload.user_id;
        req.role = findUserRole(req.user_id);
        next();
    })
}

function filterAdmin(req, res, next) {
    if (req.role === 'admin') {
        next();
    } else {
        res.status(403).end();
    }
}

async function findUserRole(id) {
    const users = await db.query(`select rol from users where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    if (users.length === 0) {
        throw new Error('No existe el usuario');
    }
    return users[0].role;
}

module.exports = { authenticateToken, filterAdmin };