'use strict';

const fastifyPlugin = require('fastify-plugin');
const controllers = require('./controllers')
const schemas = require('./schemas');


async function routes (fastify, options) {

    fastify.get('/admin/users', { preValidation: [fastify.authenticateAdmin] }, (request, reply) => {
        return controllers.getUsers(request, reply, fastify);
    });

    fastify.post('/api/signup', { schema: schemas.signupSchema }, (request, reply) => {
        return controllers.signup(request, reply, fastify)
    });
    fastify.post('/api/login', (request, reply) => {
        return controllers.login(request, reply, fastify)
    });
    fastify.post('/api/logout', { preValidation: [fastify.authenticate] }, (request, reply) => {
        return controllers.logout(request, reply, fastify)
    });

    fastify.get('/protected', { preValidation: [fastify.authenticate] }, (request, reply) => {
        return reply.send({message: `Logged as ${request.user.username}`})
    });

    fastify.get('/', { preValidation: [fastify.getToken] }, (request, reply) => {
        return reply.send(request.user ? {message: `Logged as ${request.user.username}`} : {message: "Please log in"})
    });
}

module.exports = fastifyPlugin(routes);