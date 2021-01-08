const { insert: insertUser } = require("../controllers/user");
let token = null;
let user_id = null;

async function signup(agent, user = sampleUser()) {

    if (user.role === "admin") {
        let result = await insertUser(user);
        user_id = result.user_id;
        token = result.token;
    } else {
        let { body } = (await agent.post('/users').send(user));
        user_id = body.id;
        token = body.token;
    }
}

function withToken(operation) {
    if (!token) throw new Error("Please signup first");

    return operation.set("Authorization", `Bearer ${token}`)
}

function sampleUser() {
    return {
        name: "Pendorcho Flores",
        email: "elFlores@gmail.com",
        username: "flowersp",
        password: "margaritas",
        role: "admin"
    };
}

function getToken() { return token }

function getUserId() { return user_id }

module.exports = {
    signup,
    sampleUser,
    withToken,
    getToken,
    getUserId
};