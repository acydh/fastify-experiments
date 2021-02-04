module.exports = {

    sendGenericServerError: (reply) => {
        reply.code(500).send(JSON.stringify({ "error": "Server error" }));
    },

    sendGenericLoginError: (reply) => {
        reply.code(400).send(JSON.stringify({ error: "invalid user/password combination" }));
    },

    sendAuthCookie: (reply, fastify, payload) => {
        const token = fastify.jwt.sign(payload);
        reply
            .setCookie('token', token, { // todo: Set options in a .env for dev/prod
                domain: 'localhost', 
                path: '/',
                secure: false, 
                httpOnly: true,
                sameSite: true 
            })
            .code(200)
            .send(JSON.stringify({ message: "Authenticated" }));
    }

}