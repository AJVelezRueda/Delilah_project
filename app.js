const express = require("express");
const rateLimit = require("express-rate-limit");
const routes = require("./routes/index.js");
const app = express();

app.use(express.json());
app.use(limiter)

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5
});

routes(app);

app.listen(3000, () => {
    console.log(`Api escuchando el puerto: 3000`);
});