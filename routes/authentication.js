const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    if(req.path === '/login') {
        next();
        return;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user_id) => {
        if (err) return res.sendStatus(403);
        req.user_id = user_id;
        next();
    })
}

module.exports = authenticateToken;