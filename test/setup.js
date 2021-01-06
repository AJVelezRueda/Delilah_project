let token = null;
let user_id = null;

async function signup(agent, user = sampleUser()) {
    const { body } = await agent.post('/users').send(user);
    user_id = body.id;
    token = body.token;
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
        password: "margaritas"
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