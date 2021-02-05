'use strict';

module.exports = {

    sendGenericServerError: (reply) => {
        reply.code(500).send(JSON.stringify({ "error": "Server error" }));
    },

    sendGenericLoginError: (reply) => {
        reply
            .view('login', { error: "invalid user/password combination" });
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
            });
        console.log(token);
        payload.role === 'admin' ? 
            reply.redirect('/admin') :
            reply.redirect('/');
    }
}