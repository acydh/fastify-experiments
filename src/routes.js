'use strict';

const fastifyPlugin = require('fastify-plugin');
const controllers = require('./controllers')
const schemas = require('./schemas');


async function routes (fastify, options) {

    // Admin routes

    fastify.get('/admin', { preValidation: [fastify.authenticateAdmin] }, (request, reply) => {
        return reply.view('/admin', { user: request.user });
    });

    // Authenticated routes

    fastify.get('/protected', { preValidation: [fastify.authenticate] }, (request, reply) => {
        return reply.send({message: `Logged as ${request.user.username}`})
    });

    fastify.post('/signup', { schema: schemas.signupSchema }, (request, reply) => {
        return controllers.signup(request, reply, fastify)
    });
    
    fastify.post('/logout', { preValidation: [fastify.authenticate] }, (request, reply) => {
        return controllers.logout(request, reply, fastify)
    });

    

    // Public routes

    fastify.get('/', (request, reply) => {
        return reply.view('home', {user: request.user})
    });

    fastify.post('/login', (request, reply) => {
        return controllers.login(request, reply, fastify)
    });

    fastify.get('/login', (request, reply) => {
        return reply.view('login');
    });
}

module.exports = fastifyPlugin(routes);