const express = require("express");
const rateLimit = require("express-rate-limit");
const routes = require("./routes/index.js");
const app = express();
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Api escuchando el puerto: 3000`);
});
app.use(express.json());

app.use(limiter)



routes(app);