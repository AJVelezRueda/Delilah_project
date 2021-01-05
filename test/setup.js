console.log("lala")

function signup(agent, user) {
    const { body: bodyUser } = await agent.post('/users').send(user);
    user_id = bodyUser.id;
    token = bodyUser.token;
}

function apiCall(operation) {
    return operation.set("Authorization", `Bearer ${token}`)
}