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

    fastify.get('/', (request, reply) => {
        return reply.view('home', {user: request.user})
    });
}

module.exports = fastifyPlugin(routes);